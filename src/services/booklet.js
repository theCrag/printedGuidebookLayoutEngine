import $ from 'jquery';

import { page } from '../views/page.view';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';
import { getAds, buildImageUrl } from './api.service';


export class Booklet {

  constructor() {
    this.pageCounter = 0;
    this.routeContainerCounter = 0;

    this.log = createLogger('Booklet');
  }

  init() {
    this.pageCounter = 0;
  }

  initArea() {
    this.routeContainerCounter = 0;
  }

  isLeftPage() {
    return this.pageCounter % 2 === 0;
  }

  isRightPage() {
    return !this.isLeftPage();
  }

  getCurrentPage() {
    return $(`#page-${this.pageCounter}`);
  }

  addPage() {
    this.pageCounter = this.pageCounter + 1;
    $('main').append(page(this.pageCounter, this.isLeftPage()));
    this.log.info('addPage', this.pageCounter);
  }

  addContent(html, done) {
    const page = this.getCurrentPage();
    page.append(html);

    const images = page.children().last().find('img');
    if (images.length > 0) {
      images.on('load', () => done(page));
    } else {
      done(page);
    }
  }

  addRouteMainTopo(html, done) {
    const page = this.getCurrentPage();
    const routesContainer = page.find('.routes .routes__topo').last();
    routesContainer.append(html);

    const images = routesContainer.find('img');
    if (images.length > 0) {
      images.on('load', () => done(page, routesContainer));

    } else {
      done(page, routesContainer);
    }
  }

  addRoutesToContainer(routesContainer, html, done) {
    const routesColumnContainer = routesContainer.find('.routes__columns').last();
    routesColumnContainer.append(html);

    const images = routesColumnContainer.children().not('.route--blank').last().find('img');
    if (images.length > 0) {
      images.on('load', () => done(page, routesContainer));

    } else {
      done(page, routesContainer);
    }
  }

  addRouteItem(area, html, done) {
    const page = this.getCurrentPage();
    let routesContainer = page.find('.routes').last();
    if (routesContainer.length <= 0){
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

  addRoutesContainer(area, done) {
    this.addContent(areaView.routesContainer(area.id, this.routeContainerCounter, 2), done);
    this.routeContainerCounter = this.routeContainerCounter + 1;
  }

  removeLastPage() {
    if (this.pageCounter === 1) {
      return;
    }
    this.getCurrentPage().remove();
    this.pageCounter = this.pageCounter - 1;
  }

  removeAllAreaRelatedElements(area) {
    $(`.area-${area.id}`).remove();
    $('.sheet').toArray().reverse().some((sheet) => {
      const $sheet = $(sheet);
      if ($sheet.children().length === 0) {
        this.removeLastPage();
      } else {
        return true;
      }
    });
  }

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

  addWhitespaceContainers() {
    let i = 1;
    $('.sheet').toArray().forEach((sheet) => {
      const whitespaceContainer = areaView.whitespaceContainer(i);
      const $sheet = $(sheet);
      $sheet.append(whitespaceContainer);
      i++;
    });
  }

  getWhitespaceContainers() {
    let containers = [];
    $('.whitespace').toArray().forEach((container) => {
      const $container = $(container);
      const element = {};
      element.id = $container.attr('id');
      element.page = $container.attr('id').split('-')[1];
      let maxH = this.getMaxHeight(container);
      element.maxHeight = maxH < 0 ? 0 : maxH;
      containers.push(element);
    });
    return containers;
  }

  fillWhitespaceContainers(containers, done) {
    // get all advertisements
    const ads = getAds();

    // create array with advertisements on the basis of priority
    let keys = [];
    ads.forEach((ad) => {
      ad.images.filter((image) => image.origWidth > image.origHeight);
      for (var i = 0; i < (ad.priority * 10); i++){
        keys.push(ad);
      }
    });

    // fill white spaces
    let portrait = false;
    containers
      .filter(element => element.maxHeight >= process.env.APP_AD_MIN_HEIGHT)
      .forEach((element) => {
        if (element.maxHeight > 718) {
          portrait = true;
        } else {
          portrait = false;
        }
        keys[Math.floor((Math.random() * keys.length))].images
          .filter((image) => portrait ? image.origWidth < image.origHeight : image.origWidth > image.origHeight)
          .forEach((img) => {
            const photoPath = buildImageUrl(img);
            const ad = areaView.advertisement(element.id, photoPath, element.maxHeight);
            $(`#${element.id}`).append(ad);
          });
      });

    const images = $('.advertisement').find('img');
    let totalImageCount = images.length;
    if (images.length > 0) {
      images.on('load', () => {
        if (--totalImageCount === 0){
          done();
        }
      });
    } else {
      done();
    }
  }

}
