import $ from "jquery";
import { find, last, cloneDeep } from 'lodash';

import { page } from '../views/page.view';
import { createLogger } from '../utils/logger';

const log = createLogger('page');

let idCounter = 0;

export const init = () => idCounter = 0;

export const addPage = () => {
  idCounter = idCounter + 1;
  $('main').append(page(idCounter));
  log.info('addPage', idCounter)
};

export const addContent = (content) => (done) => {
  log.info('addContent to', idCounter)
  const page = $(`#page-${idCounter}`)
  page.append(content);

  const images = page.children().last().find('img');
  if (images.length > 0) {
    images.on('load', () => validatePage(page, content, done));
  } else {
    validatePage(page, content, done);
  }
};

export const validatePage = (page, content, done) => {
  const lastElement = last(page.children());
  if (!isElementInsideCurrentSheet(lastElement)) {
    log.info('content has not space in sheet')
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

  // log.info('closest(.sheet)', parentSheet);
  // log.info('totalPageHeight', totalPageHeight);
  // log.info('elementBottom', elementBottom);
  log.info('isElementInsideCurrentSheet', elementBottom < totalPageHeight);
  return elementBottom < totalPageHeight;
}

// const pages = [new Sheet(1)];

// const getLastPage = () => Object.assign({}, last(pages));

// export const getAllPages = () => cloneDeep(pages);

// export const getPageById = (id) => Object.assign({}, find(pages, { id }));

// export const getPageSize = () => pages.length;

// export const addContent = (content) => {
//   const lastPageIndex = getPageSize() - 1;
//   pages[lastPageIndex].content.push(content);
//   // Vue.$eventBus.$emit('PAGE_CHANGED', getLastPage().id);
// };

// export const goToNextPage = () => {
//   const content = pages[getPageSize() - 1].content.pop();
//   // Vue.$eventBus.$emit('PAGE_CHANGED', getLastPage().id);

//   pages.push(new Sheet(getPageSize() + 1));
//   pages[getPageSize() - 1].content.push(content);
//   // Vue.$eventBus.$emit('PAGE_CHANGED', getLastPage().id);
// };

// export const goToNextPageWith = (changes) => {
//   pages[getPageSize() - 1].content.pop();
//   pages[getPageSize() - 1].content.push(changes.contentOldPage);
//   // Vue.$eventBus.$emit('PAGE_CHANGED', getLastPage().id);

//   pages.push(new Sheet(getPageSize() + 1));
//   pages[getPageSize() - 1].content.push(changes.contentNewPage);
//   // Vue.$eventBus.$emit('PAGE_CHANGED', getLastPage().id);
// };
