import $ from "jquery";
import { find, last, cloneDeep } from 'lodash';

import { page } from '../views/page.view';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';

const log = createLogger('page');

let pageCounter = 0;

export const init = () => pageCounter = 0;

export const addPage = () => {
  pageCounter = pageCounter + 1;
  $('main').append(page(pageCounter));
  log.info('addPage', pageCounter)
};

export const addContent = (content) => (done) => {
  // log.info('addContent to', pageCounter);
  const page = $(`#page-${pageCounter}`);
  page.append(content);

  const images = page.children().last().find('img');
  if (images.length > 0) {
    images.on('load', () => validatePage(page, content, done));
  } else {
    validatePage(page, content, done);
  }
};

export const addRouteMainTopo = () => (done) => { };

export const addRoutesContainer = () => addContent(areaView.routesContainer(2));

export const addRouteItem = (content) => (done) => {
  // log.info('addRouteItem to', pageCounter);
  const page = $(`#page-${pageCounter}`);
  const routesContainer = page.find('.routes .routes__columns').first();
  routesContainer.append(content);

  const images = routesContainer.children().not('.route--blank').last().find('img');
  if (images.length > 0) {
    images.on('load', () => validateRoutes(page, routesContainer, content, done));
  } else {
    validateRoutes(page, routesContainer, content, done);
  }

};

export const validateRoutes = (page, routesContainer, content, done) => {
  const areSomeRoutesOutsideTheSheet = !routesContainer
    .children()
    .toArray()
    .some(c => !isElementInsideCurrentSheet(c));

  if (!areSomeRoutesOutsideTheSheet) {
    // log.info('the last route has no space in sheet');
    const lastElement = last(routesContainer.children());
    lastElement.remove();
    addPage();
    addRoutesContainer()(() => {
      addRouteItem(content)(done);
    });
  } else {
    done();
  }
}

export const validatePage = (page, content, done) => {
  const lastElement = last(page.children());
  if (!isElementInsideCurrentSheet(lastElement)) {
    log.info('content has no space in sheet');
    lastElement.remove();
    addPage();
    addContent(content)(done);
  } else {
    done();
  }
}

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

