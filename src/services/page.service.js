import $ from "jquery";
import { first, find, last, cloneDeep } from 'lodash';

import { page } from '../views/page.view';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';
import { getPhotos, getImageUrl } from "./api.service";

const log = createLogger('page');

let pageCounter = 0;
let routeContainerCounter = 0;

export const init = () => pageCounter = 0;

export const initArea = () => {
  routeContainerCounter = 0;
};

export const isLeftPage = () => pageCounter % 2 === 0;
export const isRightPage = () => !isLeftPage();

export const getCurrentPage = () => $(`#page-${pageCounter}`);

export const addPage = () => {
  pageCounter = pageCounter + 1;
  $('main').append(page(pageCounter, isLeftPage()));
  // log.info('addPage', pageCounter)
};

export const removeLastPage = () => {
  if (pageCounter === 1) {
    return;
  }
  getCurrentPage().remove();
  pageCounter = pageCounter - 1;
};

export const prepareLeftPage = () => (done) => {
  addPage();
  if (isRightPage()) {
    addPage();
  }
  done();
};

export const addRoutesContainer = (area) => (done) => {
  addContent(area, areaView.routesContainer(area.id, routeContainerCounter, 2))(done);
  routeContainerCounter = routeContainerCounter + 1;
};

export const addContent = (area, content) => (done) => {
  // log.info('addContent to', pageCounter);
  const page = getCurrentPage();
  page.append(content);

  const images = page.children().last().find('img');
  if (images.length > 0) {
    images.on('load', () => validatePage(area, page, content, done));
  } else {
    validatePage(area, page, content, done);
  }
};

export const addFullPageTopo = (area, content) => (done) => {
  // TODO:
  debugger;
  done();
};

export const addRouteMainTopo = (area, content) => (done) => {
  const page = getCurrentPage();
  const routesContainer = page.find('.routes .routes__topo').last();
  routesContainer.append(content);

  const images = routesContainer.find('img');
  if (images.length > 0) {
    images.on('load', () => validateRoutes(area, page, routesContainer, content, 'addRouteMainTopo', undefined, done));
  } else {
    validateRoutes(area, page, routesContainer, content, 'addRouteMainTopo', undefined, done);
  }
};

export const addRouteItem = (area, content, index) => (done) => {
  // log.info('addRouteItem to', pageCounter);
  const page = getCurrentPage();
  const routesContainer = page.find('.routes').last();
  const routesColumnContainer = routesContainer.find('.routes__columns').last();
  routesColumnContainer.append(content);

  const images = routesColumnContainer.children().not('.route--blank').last().find('img');
  if (images.length > 0) {
    images.on('load', () => validateRoutes(area, page, routesContainer, content, 'addRouteItem', index, done));
  } else {
    validateRoutes(area, page, routesContainer, content, 'addRouteItem', index, done);
  }

};

export const validateRoutes = (area, page, routesContainer, content, func, index, done) => {
  const areSomeRoutesOutsideTheSheet = routesContainer.find('.topo, .route')
    .children()
    .toArray()
    .some(c => !isElementInsideCurrentSheet(c));

  if (areSomeRoutesOutsideTheSheet) {
    if ('addRouteMainTopo' === func) {
      routesContainer.remove();
      removePossibleRouteZombies();
      addPage();
      addRoutesContainer(area)(() => {
        addRouteMainTopo(area, content)(done);
      });

    } else {
      const lastElement = routesContainer.find('.route').not('.route--blank').last();
      lastElement.remove();
      removePossibleRouteZombies();
      addPage();
      addRoutesContainer(area)(() => {
        const secondLastElement = routesContainer.find('.route').not('.route--blank').last();
        const $secondLastElement = $(secondLastElement);
        if ($secondLastElement.hasClass('route--topo')) {
          $secondLastElement.remove();
          addRouteItem(area, $secondLastElement.html(), index - 1)(() => {
            addRouteItem(area, content, index)(done);
          });

        } else {
          addRouteItem(area, content, index)(done);
        }
      });
    }

  } else {
    done();

  }
};

export const validatePage = (area, page, content, done) => {
  const lastElement = last(page.children());

  if (!isElementInsideCurrentSheet(lastElement)) {

    const $lastElement = $(lastElement);
    const id = $lastElement.attr('id');

    if (id) {
      if (id.startsWith('description')) {
        return validateDescription(area, lastElement, page, content, done);
      }

      if (id.startsWith('geometry')) {
        return validateGeometry(area, lastElement, page, content, done);
      }
    }

    // move last element to new page
    lastElement.remove();
    addPage();
    addContent(area, content)(done);

  } else {
    done();
  }
}

export const validateArea = (area, reset) => (done) => {
  const routes = $(`.routes.area-${area.id}`);
  if (routes.length > 1) {
    log.info('validateArea', area, routes);

    // Check if topo got missing on a right page
    const isFirstRoutesPageRight = routes.first().closest('.sheet').hasClass('sheet--right');
    if (isFirstRoutesPageRight && !area.routesNeedToStartOnALeftPage) {
      if (countRouteItems(routes.first()) === 1) {
        area.routesNeedToStartOnALeftPage = true;
        return reset();
      }
    }

    // Validate if the last route of a topo is in sight, otherwise start with the topo on
    // left top page.
    let restartRendering = false;
    area.routeItems = area.routeItems.map(item => {
      if (item.type === 'Topo') {

        if (item.routesResponsible.length > 0) {
          const topoElement = $(`#topo-${item.id}`);
          const topoPageElement = topoElement.closest('.sheet');
          const topoPageElementIsALeftPage = topoPageElement.hasClass('sheet--left');
          const pageElements = [topoPageElement];

          if (topoPageElementIsALeftPage) {
            const idPagePairs = topoPageElement.attr('id').split('-');
            const nextTopoPage = $(`#page-${parseInt(first(idPagePairs), 10) + 1}`);
            pageElements.push(nextTopoPage);

          }

          const pages = $(pageElements.map(e => `#${e.attr('id')}`).join(', '));
          const lastRouteInSight = topoPageElement.find(`#route-${area.id}-${first(item.routesResponsible)}`);

          if (lastRouteInSight.length === 0 && !item.startOnLeftPage && !restartRendering) {
            item.startOnLeftPage = true;
            restartRendering = true;

          }
        }

      }
      return item;
    });

    if (restartRendering) {
      return reset();
    }

    done();
  } else {
    done();
  }
};

export const countRouteItems = (routesContainer) => {
  const amountTopo = $(routesContainer).find('.topo').not('.route--blank').length;
  const amountRoutes = $(routesContainer).find('.route').not('.route--blank').length;
  return amountTopo + amountRoutes;
}

export const isElementInsideCurrentSheet = (element) => {
  if (element) {
    const parentSheet = $(element.closest('.sheet'));
    element = $(element);

    const sheetOffset = parentSheet.offset() || { top: 0 };
    const paddingTop = parseFloat(parentSheet.css('padding-top').slice(0, -2));
    const totalPageHeight = sheetOffset.top + paddingTop + (parentSheet.height() || 0);
    const elementOffset = element.offset() || { top: 0 };
    const elementBottom = elementOffset.top + (element.height() || 0);

    return elementBottom < totalPageHeight;
  }
  return true;
}

export const removePossibleRouteZombies = () => {
  // Remove possible routes zombies
  const routes = getCurrentPage().children('.routes');
  if (routes.length === 0) {
    return;
  }
  const $lastRouteContainer = $(routes[0]);
  const hasTopos = $lastRouteContainer.children('.routes__topo').find('.topo').length > 0;
  const hasRoutes = $lastRouteContainer.children('.routes__columns').find('.route').not('.route--blank').length > 0;

  // Remove empty route containers
  if (!hasTopos && !hasRoutes) {
    log.warn('Remove empty routes container');
    $lastRouteContainer.remove();
  }
}

export const appendToLastDescription = (area, content) => (done) => {
  const page = getCurrentPage();
  const lastElement = last(page.children());
  $(lastElement).children()[$(lastElement).children().length - 1].innerText += content;
  validatePage(area, page, content, done);
};

export const validateGeometry = (area, lastElement, page, content, done) => {

  let secondLastIsTitle = false;
  let secondLastElement = null;
  secondLastElement = page.children()[page.children().length - 2];
  if ($(secondLastElement).attr('id')) {
    if ($(secondLastElement).attr('id') === 'title-' + area.id) {
      secondLastIsTitle = true;
    }
  }

  // move last element to new page
  lastElement.remove();
  addPage();

  // move title or last element to new page
  if (secondLastIsTitle) {
    secondLastElement.remove();
    addContent(area, secondLastElement)(() => addContent(area, content)(done));
  } else {
    addContent(area, content)(done);
  }
}

export const validateDescription = (area, lastElement, page, content, done) => {
  const areaId = $(lastElement).attr('id').split('-')[1];
  const index = $(lastElement).attr('id').split('-')[2];
  let descArray = [];
  let innerTextDesc = [];
  const delimiter = process.env.APP_SPLIT_DESCRIPTIONS_BY.substr(1).slice(0, -1);

  // remove the last word until the text fits in page
  while (!isElementInsideCurrentSheet(lastElement)) {
    const lastChild = last($(lastElement).children());
    switch (lastChild.tagName) {
      // how to proceed when the element is a <p></p>
      case 'P':
        // check if innerText exists, when not remove the element
        if (lastChild.innerText === "") {
          lastChild.remove();
          // check if there is some text exported from the removed <p></p>, if yes, create a new P and add to array
          if (innerTextDesc.length > 0) {
            let newP = $.parseHTML('<p></p>')[0];
            newP.innerText = innerTextDesc.join(delimiter);
            descArray.unshift(newP);
            innerTextDesc = [];
          }
        } else {
          // if innerText exists, remove the last word
          let oldDesc = lastChild.innerText.split(delimiter);
          innerTextDesc.unshift(oldDesc.pop());
          lastChild.innerText = oldDesc.join(delimiter);
        }
        break;
      default:
        // move the whole element on new page
        descArray.unshift(lastChild);
        lastChild.remove();
        break;
    }
    // move the title, if this is the lastElement
    const lastChildTitle = last($(lastElement).children());
    if (lastChildTitle.tagName === "H2") {
      descArray.unshift(lastChildTitle);
      lastChildTitle.remove();
    }
  }

  // cleanup if the description block is empty now
  if ($(lastElement).children().length === 0) {
    $(lastElement).remove();
  }

  // create new <p></p> for left over text
  if (innerTextDesc.length > 0) {
    let newP = $.parseHTML('<p></p>')[0];
    newP.innerText = innerTextDesc.join(delimiter);
    descArray.unshift(newP);
  }

  // add new page and append previously removed elements
  // let desc = descArray.map((e) => $(desc).append(e));
  // log.info(descArray);
  // if (desc.length < process.env.APP_WIDOW_BOUNDARY) {
  //   getPhotos(area.id, (photos) => {
  //     const photoPath = getImageUrl(photos[0]);
  //     const photo = areaView.photo(area, descId, photoPath);
  //     lastElement.remove();
  //     addContent(area, photo)(() => addContent(area, lastElement)(() => appendToLastDescription(area, desc)(done)));
  //   });
  // } else {
  addPage();
  let html = $.parseHTML(areaView.emptyDescription(areaId, index));
  descArray.map((e) => $(html).append(e));
  addContent(area, html)(done);
  // }
}

export const removeAllAreaRelatedElements = (area) => {
  $(`.area-${area.id}`).remove();
  $('.sheet').toArray().reverse().forEach((sheet) => {
    const $sheet = $(sheet);
    if ($sheet.children().length === 0) {
      removeLastPage();
    }
  });
};
