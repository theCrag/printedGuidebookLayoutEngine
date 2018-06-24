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
  if (!isElementInsideCurrentSheet(lastElement)) {
    // log.info('content has no space in sheet');
    lastElement.remove();
    addPage();
    addContent(content)(done);
  } else {
    done();
  }
}

export const validateArea = (area) => (done) => {
  const routes = $(`.routes--${area.id}`);
  log.info('validateArea', area, routes);
  // debugger;
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

  // log.info('isElementInsideCurrentSheet', elementBottom < totalPageHeight);
  return elementBottom < totalPageHeight;
}

