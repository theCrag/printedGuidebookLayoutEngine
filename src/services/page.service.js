import $ from "jquery";
import { find, last, cloneDeep } from 'lodash';

import { page } from '../views/page.view';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';

const log = createLogger('page');

let pageCounter = 0;
let areaId;
let routeContainerCounter = 0;

export const init = () => pageCounter = 0;

export const initArea = (area) => {
  areaId = area.id
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

export const addRoutesContainer = () => (done) => {
  addContent(areaView.routesContainer(areaId, 2))(done);
  routeContainerCounter = routeContainerCounter + 1;
};

export const addContent = (content) => (done) => {
  // log.info('addContent to', pageCounter);
  const page = getCurrentPage();
  page.append(content);

  const images = page.children().last().find('img');
  if (images.length > 0) {
    images.on('load', () => validatePage(page, content, done));
  } else {
    validatePage(page, content, done);
  }
};

export const addRouteMainTopo = (content) => (done) => {
  const page = getCurrentPage();
  const routesContainer = page.find('.routes .routes__topo').last();
  routesContainer.append(content);

  const images = routesContainer.find('img');
  if (images.length > 0) {
    images.on('load', () => validateRoutes(page, routesContainer, content, 'addRouteMainTopo', undefined, done));
  } else {
    validateRoutes(page, routesContainer, content, 'addRouteMainTopo', undefined, done);
  }
};

export const addRouteItem = (content, index) => (done) => {
  // log.info('addRouteItem to', pageCounter);
  const page = getCurrentPage();

  if (index === 1) {
    const routes = $(`.routes--${areaId}`);
    if (routes.length > 1) {
      $(routes[0]).appendTo(routes[1]);
    }
  }

  const routesContainer = page.find('.routes .routes__columns').last();
  routesContainer.append(content);

  const images = routesContainer.children().not('.route--blank').last().find('img');
  if (images.length > 0) {
    images.on('load', () => validateRoutes(page, routesContainer, content, 'addRouteItem', index, done));
  } else {
    validateRoutes(page, routesContainer, content, 'addRouteItem', index, done);
  }

};

export const validateRoutes = (page, routesContainer, content, func, index, done) => {
  const areSomeRoutesOutsideTheSheet = !routesContainer
    .children()
    .toArray()
    .some(c => !isElementInsideCurrentSheet(c));

  if (!areSomeRoutesOutsideTheSheet) {
    // log.info('the last route has no space in sheet');
    // debugger;
    const lastElement = last(routesContainer.children().not('.route--blank'));
    lastElement.remove();
    addPage();
    addRoutesContainer()(() => {
      if ('addRouteMainTopo' === func) {
        addRouteMainTopo(content)(done);
      } else {
        addRouteItem(content, index)(done);
      }
    });
  } else {
    done();
  }
}

export const validatePage = (page, content, done) => {
  const lastElement = last(page.children());
  let secondLastIsTitle = false;
  let secondLastElement = null;
  if (!isElementInsideCurrentSheet(lastElement)) {

    // split description text if it is a description
    if ($(lastElement).attr('id').startsWith('description')) {
      const descId = $(lastElement).attr('id');
      let descArray = [];
      // remove the last word until the text fits in page
      while (!isElementInsideCurrentSheet(lastElement)) {
        let oldDesc = $(lastElement).children()[$(lastElement).children().length - 1].innerText.split(' ');
        descArray.unshift(oldDesc.pop());
        $(lastElement).children()[$(lastElement).children().length - 1].innerText = oldDesc.join(' ');
      }
      // add new page and append previously removed text
      addPage();
      const desc = descArray.join(' ');
      let newDesc = `
        <div id="${descId}" class="description">
        <p>${desc}</p>
      </div>`;
      addContent(newDesc)(done);

    } else {

      // take title to next page if geometry has no space
      if ($(lastElement).attr('id').startsWith('geometry')) {
        const areaId = $(lastElement).attr('id').split('-')[1];
        secondLastElement = page.children()[page.children().length - 2];
        if ($(secondLastElement).attr('id')) {
          if ($(secondLastElement).attr('id') === 'title-' + areaId) {
            secondLastIsTitle = true;
          }
        }
      }

      // move last element to new page
      lastElement.remove();
      addPage();

      // move title or last element to new page
      if (secondLastIsTitle) {
        secondLastElement.remove();
        addContent(secondLastElement)(() => addContent(content)(done));
      } else {
        addContent(content)(done);
      }
    }
  } else {
    done();
  }
}

export const validateArea = (area) => (done) => {
  const routes = $(`.routes--${area.id}`);
  if (routes.length > 0) {
    log.info('validateArea', area, routes);
    debugger;

  }
  done();
};

export const isElementInsideCurrentSheet = (element) => {
  const parentSheet = $(element.closest('.sheet'));
  element = $(element);

  const sheetOffset = parentSheet.offset() || { top: 0 };
  const paddingTop = parseFloat(parentSheet.css('padding-top').slice(0, -2));
  const totalPageHeight = sheetOffset.top + paddingTop + (parentSheet.height() || 0);
  const elementOffset = element.offset() || { top: 0 };
  const elementBottom = elementOffset.top + (element.height() || 0);

  return elementBottom < totalPageHeight;
}

