import $ from "jquery";
import { find, last, cloneDeep } from 'lodash';

import { page } from '../views/page.view';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';

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

export const addRoutesContainer = (area, isFirst) => (done) => {
  // if (area.breakBeforeRoutes && isFirst) {
  //   addPage();
  //   if (isRightPage()) {
  //     addPage();

  //   }
  // }
  addContent(area, areaView.routesContainer(area.id, 2))(done);
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

  // If this is the second route element and it happens that we have already
  // 2 pages of routes we copy the first route element into the 2 page.
  if (index === 1) {
    const routes = $(`.routes--${area.id}`);
    if (routes.length > 1) {
      log.warn('Move first route item to the new page');
      const previousRoutes = $(routes[0]);
      const currentRoutes = $(routes[1]);
      previousRoutes.children('.routes__topo').children().appendTo(currentRoutes.children('.routes__topo'));
      previousRoutes.children('.routes__columns').children().appendTo(currentRoutes.children('.routes__columns'));
      previousRoutes.remove();
    }
  }

  const routesContainer = page.find('.routes .routes__columns').last();
  routesContainer.append(content);

  const images = routesContainer.children().not('.route--blank').last().find('img');
  if (images.length > 0) {
    images.on('load', () => validateRoutes(area, page, routesContainer, content, 'addRouteItem', index, done));
  } else {
    validateRoutes(area, page, routesContainer, content, 'addRouteItem', index, done);
  }

};

export const validateRoutes = (area, page, routesContainer, content, func, index, done) => {
  const areSomeRoutesOutsideTheSheet = !routesContainer
    .children()
    .toArray()
    .some(c => !isElementInsideCurrentSheet(c));

  if (!areSomeRoutesOutsideTheSheet) {
    // log.info('the last route has no space in sheet');
    const lastElement = last(routesContainer.children().not('.route--blank'));
    lastElement.remove();
    removePossibleRouteZombies();
    addPage();

    addRoutesContainer(area)(() => {
      if ('addRouteMainTopo' === func) {
        addRouteMainTopo(area, content)(done);

      } else {
        const secondLastElement = last(routesContainer.children().not('.route--blank'));
        const $secondLastElement = $(secondLastElement);
        if ($secondLastElement.hasClass('route--topo')) {
          $secondLastElement.remove();
          addRouteItem(area, $secondLastElement.html(), index - 1)(() => {
            addRouteItem(area, content, index)(done);
          });

        } else {
          addRouteItem(area, content, index)(done);
        }
      }
    });

  } else {
    done();
  }
}

export const validatePage = (area, page, content, done) => {
  const lastElement = last(page.children());

  if (!isElementInsideCurrentSheet(lastElement)) {

    const $lastElement = $(lastElement);
    const id = $lastElement.attr('id');

    if (id.startsWith('description')) {
      return validateDescription(area, lastElement, page, content, done);
    }

    if (id.startsWith('geometry')) {
      return validateGeometry(area, lastElement, page, content, done);
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
  const routes = $(`.routes-${area.id}`);
  if (routes.length > 1) {
    log.info('validateArea', area, routes);
    // const isFirstRoutesPageRight = routes.first().closest('.sheet').hasClass('sheet--right');
    // if (isFirstRoutesPageRight && !area.breakBeforeRoutes) {
    //   area.breakBeforeRoutes = true;
    //   return reset();
    // }
    done();
  } else {
    done();
  }
};

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
  const descId = $(lastElement).attr('id');
  let descArray = [];
  // remove the last word until the text fits in page
  const delimiter = process.env.SPLIT_DESCRIPTIONS_BY.substr(1).slice(0, -1);
  while (!isElementInsideCurrentSheet(lastElement)) {
    let oldDesc = $(lastElement).children()[$(lastElement).children().length - 1].innerText.split(delimiter);
    descArray.unshift(oldDesc.pop());
    $(lastElement).children()[$(lastElement).children().length - 1].innerText = oldDesc.join(delimiter);
  }
  // add new page and append previously removed text
  const desc = descArray.join(delimiter);
  if (desc.length < process.env.WIDOW_BOUNDARY) {
    let photos = [];
    $.getJSON(`https://www.thecrag.com/area/${area.id}/photos/json?key=${process.env.API_KEY}`, function (data) {
      data.data.photos.forEach(element => {
        photos.push(element);
      });
    }).done(() => {
      const photoPath = (photos[0].hashID) ? `https://static.thecrag.com/original-image/${photos[0].hashID.substring(0, 2)}/${photos[0].hashID.substring(2, 4)}/${photos[0].hashID}` : undefined;
      const photo = `
      <div id="photo-${descId}" class="photo">
        <img src="${photoPath}" />
      </div>`;
      lastElement.remove();
      addContent(area, photo)(() => addContent(area, lastElement)(() => appendToLastDescription(area, desc)(done)));
    });
  } else {
    addPage();
    let newDesc = `
    <div id="${descId}" class="description">
      <p>${desc}</p>
    </div>`;
    addContent(area, newDesc)(done);
  }
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
