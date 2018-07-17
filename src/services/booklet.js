import $ from 'jquery';
import { last } from 'lodash';

import { page } from '../views/page.view';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';
import { getAds, buildImageUrl } from './api.service';

/**
 * The booklet class keeps track of the rendered pages.
 */
export class Booklet {

  constructor() {
    this.pageCounter = 0;
    this.routeContainerCounter = 0;

    this.log = createLogger('Booklet');
  }

  /**
   * Sets the current page to zero. To restart
   * the booklet creation. The page counter is used
   * to mark the pages with their number.
   */
  init() {
    this.pageCounter = 0;
  }

  /**
   * Resets the routes container counter. This counter is used
   * for the routes container to mark them with an index to be
   * identical.
   */
  initArea() {
    this.routeContainerCounter = 0;
  }

  /**
   * Returns if it is a left page or not.
   *
   * @returns {boolean} isLeftPage
   */
  isLeftPage() {
    return this.pageCounter % 2 === 0;
  }

  /**
   * Returns if it is a right page or not.
   *
   * @returns {boolean} isRightPage
   */
  isRightPage() {
    return !this.isLeftPage();
  }

  /**
   * Returns the last page.
   *
   * @returns {Object} currentPage
   */
  getCurrentPage() {
    return $(`#page-${this.pageCounter}`);
  }

  /**
   * Sets the root title in header on every page
   *
   * @param {string} title
   */
  setRootTitle(title) {
    $('.root-title').html(title);
  }

  /**
   * Adds a new empty page.
   */
  addPage() {
    this.pageCounter = this.pageCounter + 1;
    $('main').append(page(this.pageCounter, this.isLeftPage()));
    $('.total-pages').html(this.pageCounter);
    this.log.info('addPage', this.pageCounter);
  }

  /**
   * Adds content to the current page.
   *
   * @param {string} html
   * @param {Function} done
   */
  addContent(html, done) {
    const page = this.getCurrentPage();
    page.append(html);

    const images = page.children().last().find('img').not('.logo');
    if (images.length > 0) {
      images.on('load', () => done(page));
    } else {
      done(page);
    }
  }

  /**
   * Adds a full width topo image before the upcoming routes.
   *
   * @param {string} html
   * @param {Function} done
   */
  addRouteMainTopo(html, done) {
    const page = this.getCurrentPage();
    const routesContainer = page.find('.routes .routes__topo').last();
    routesContainer.append(html);

    const images = routesContainer.find('img').not('.logo');
    if (images.length > 0) {
      images.on('load', () => done(page, routesContainer));

    } else {
      done(page, routesContainer);
    }
  }

  /**
   * Adds a route or a topo with width of the column.
   *
   * @param {Area} area
   * @param {string} html
   * @param {Function} done
   */
  addRouteItem(area, html, done) {
    const page = this.getCurrentPage();
    let routesContainer = page.find('.routes').last();
    if (routesContainer.length <= 0) {
      this.addRoutesContainer(area, () => {
        routesContainer = page.find('.routes').last();
        this.addRoutesToContainer(routesContainer, html, (page, routesContainer) => {
          done(page, routesContainer);
        });
      });
    } else {
      this.addRoutesToContainer(routesContainer, html, (page, routesContainer) => {
        done(page, routesContainer);
      });
    }
  }

  /**
   * Adds a route item to the container and verifies if the appended
   * element is image, so it can hold until the image is fully loaded in the DOM.
   *
   * @param {Object} routesContainer
   * @param {string} html
   * @param {Function} done
   */
  addRoutesToContainer(routesContainer, html, done) {
    const routesColumnContainer = routesContainer.find('.routes__columns').last();
    routesColumnContainer.append(html);

    const images = routesColumnContainer.children().not('.route--blank').last().find('img').not('.logo');
    if (images.length > 0) {
      images.on('load', () => done(page, routesContainer));

    } else {
      done(page, routesContainer);
    }
  }

  /**
   * Adds a routes container with the configured column amount.
   * All the upcoming routes and topos will be added to this container.
   *
   * @param {Area} area
   * @param {Function} done
   */
  addRoutesContainer(area, done) {
    this.addContent(areaView.routesContainer(area.id, this.routeContainerCounter, process.env.APP_COLUMNS), done);
    this.routeContainerCounter = this.routeContainerCounter + 1;
  }

  /**
   * Removes the last page.
   */
  removeLastPage() {
    if (this.pageCounter === 1) {
      return;
    }
    this.getCurrentPage().remove();
    this.pageCounter = this.pageCounter - 1;
  }

  /**
   * Removes the whole content of an area and as well empty pages at the end.
   *
   * @param {Area} area
   */
  removeAllAreaRelatedElements(area) {
    $(`.area-${area.id}`).remove();
    $('.sheet').toArray().reverse().some((sheet) => {
      const $sheet = $(sheet);
      if ($sheet.children().length === 2) {
        this.removeLastPage();
      } else {
        return true;
      }
    });
  }

  /**
   * Due to the optimization work in can happen that some
   * empty route containers lay in the DOM. So this method
   * remove those mentioned containers.
   */
  removePossibleRouteZombies() {
    // Remove possible routes zombies
    const routes = this.getCurrentPage().children('.routes');
    if (routes.length === 0) {
      return;
    }
    const $lastRouteContainer = $(routes[0]);
    const hasTopos = $lastRouteContainer.children('.routes__topo').find('.topo').length > 0;
    const hasRoutes = $lastRouteContainer.children('.routes__columns').find('.route').not('.route--blank').length > 0;

    // Remove empty route containers
    if (!hasTopos && !hasRoutes) {
      this.log.warn('Remove empty routes container');
      $lastRouteContainer.remove();
    }
  }

  /**
   * Takes a jQuery element and checks if the element fits in the current page.
   *
   * @param {Object} element
   * @returns {boolean} fits
   */
  isElementInsideCurrentSheet(element) {
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

  /**
   * Takes a jQuery element and returns the max available height for this element.
   *
   * @param {Object} element
   * @returns {number} maxHeight
   */
  getMaxHeight(element) {
    if (element) {
      const parentSheet = $(element.closest('.sheet'));
      element = $(element);

      const sheetOffset = parentSheet.offset();
      const paddingTop = parseFloat(parentSheet.css('padding-top').slice(0, -2));
      const totalPageHeight = sheetOffset.top + paddingTop + parentSheet.height();
      const elementOffset = element.offset();
      const elementTop = elementOffset.top;

      return parseInt(totalPageHeight - elementTop);
    }
    return 0;
  }

  /**
   * Adds whitespaceContainers to the end of each page.
   */
  addWhitespaceContainers() {
    let sheets = $('.sheet').toArray();
    sheets.shift();
    let i = 1;
    sheets.forEach((sheet) => {
      const whitespaceContainer = areaView.whitespaceContainer(i);
      const $sheet = $(sheet);
      $sheet.append(whitespaceContainer);
      i++;
    });
  }

  /**
   * Returns an array containing all elements with class ".whitespace".
   *
   * @returns {Array} containers
   */
  getWhitespaceContainers() {
    let containers = [];
    $('.whitespace').toArray().forEach((container) => {
      const $container = $(container);
      const element = {};
      element.id = $container.attr('id');
      element.page = $container.attr('id').split('-')[1];
      element.filled = false;
      let maxH = this.getMaxHeight(container);
      element.maxHeight = maxH < 0 ? 0 : maxH;
      element.portrait = element.maxHeight > process.env.APP_CONTENT_WIDTH ? true : false;
      containers.push(element);
    });
    return containers;
  }

  /**
   * Physically appends an advertisement to the element.
   *
   * @param {Object} element
   * @param {Array} containers
   * @param {boolean} float
   * @param {string} hashID
   */
  addAdvertisement(element, containers, float, hashID = null) {
    const advertisements = getAds();

    // Filter advertisements to avoid having the same advertisements next to each other
    const ads = advertisements.filter((ad) => ad.images.every((image) => float ? image.hashID !== hashID : true));

    // Take random advertisement from array with advertisement priorities
    ads[Math.floor((Math.random() * ads.length))].images
      .filter((image) => element.portrait ? image.origWidth < image.origHeight : image.origWidth > image.origHeight)
      .forEach((img) => {
        const photoPath = buildImageUrl(img);
        let ad;
        if (!float) {
          if (!element.filled) {
            // If image is to small, append it to the last element
            if (parseInt(img.origHeight) + parseInt(process.env.APP_AD_MIN_HEIGHT) >= element.maxHeight) {
              ad = areaView.advertisement(element.id, photoPath, element.maxHeight, img.hashID);
              $(`#${element.id}`).append(ad);
              element.filled = true;
            } else {
              let lastElement = last(
                containers
                  .filter(element => element.filled !== true)
                  .filter(element => element.maxHeight >= process.env.APP_AD_MIN_HEIGHT)
              );
              ad = areaView.advertisement(element.id, photoPath, lastElement.maxHeight, img.hashID);
              $(`#${lastElement.id}`).append(ad);
              lastElement.filled = true;
              this.addAdvertisement(element, containers, float, hashID);
            }
          }
        } else {
          ad = areaView.advertisementRight(element.id, photoPath, element.maxHeight, img.hashID);
          $(`#${element.id}`).append(ad);
        }

      });
  }

  /**
   * Appends an advertisement to a whitespace-container.
   *
   * @param {Array} containers
   * @param {Function} done
   */
  fillWhitespaceContainers(containers, done) {
    containers
      .filter(element => element.maxHeight >= process.env.APP_AD_MIN_HEIGHT)
      .sort((a, b) => { return b.maxHeight - a.maxHeight; })
      .forEach((element) => {
        this.addAdvertisement(element, containers, false);
      });

    // Wait for image loading
    const images = $('.advertisement').find('img').not('.logo');
    let totalImageCount = images.length;
    if (images.length > 0) {
      images.on('load', () => {
        if (--totalImageCount === 0) {
          done();
        }
      });
    } else {
      done();
    }
  }

  /**
   * Appends a second advertisement to a whitespace-container.
   *
   * @param {Array} containers
   * @param {Function} done
   */
  fillAdditionalWhitespaceContainers(containers, done) {
    containers
      .filter(element => element.maxHeight >= process.env.APP_AD_MIN_HEIGHT)
      .filter(element => $(`#${element.id}`).children().length !== 0)
      .forEach((element) => {
        $(`#${element.id}`).children().toArray().forEach((e) => {
          $(e).children().toArray().forEach((img) => {
            if (img.clientWidth < process.env.APP_CONTENT_WIDTH / 2) {
              const hashID = $(img).parent().attr('hashID');
              this.addAdvertisement(element, containers, true, hashID);
              $(img).parent().addClass('advertisement-two');
            }
          });
        });
      });

    // Wait for image loading
    const images = $('.advertisement-right').find('img').not('.logo');
    let totalImageCount = images.length;
    if (images.length > 0) {
      images.on('load', () => {
        if (--totalImageCount === 0) {
          done();
        }
      });
    } else {
      done();
    }
  }


}
