import $ from 'jquery';
import { last } from 'lodash';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';
import { getAds, buildImageUrl } from './api.service';

export class Advertisements {

  constructor(booklet) {
    this.booklet = booklet;
    this.advertisements = [];

    this.log = createLogger('Advertisements');
  }

  /**
   * Gets a prioritised array with all advertisements
   */
  init() {
    this.advertisements = getAds();
  }

  /**
   * Replaces a blank DIV with an advertisement DIV and inserts a new blank DIV below.
   * The blank DIVs are mandatory to solve some issues with images and CSS-columns.
   *
   * @param {Object} element
   * @param {string} id
   */
  replaceBlankWithAdvertisement(element, id){
    element.attr('id', id);
    element.addClass('advertisement-column');
    element.addClass('whitespace');
    element.removeClass('route--blank');
    element.after('<div class="route route--blank"></div>');
  }

  /**
   * Generates an element containing necessary information regarding advertisements.
   *
   * @param {string} id
   * @param {number} page
   * @param {number} maxHeight
   * @param {boolean} portrait
   * @param {boolean} column
   */
  generateAdvertisementElement(id, page, maxHeight, portrait, column){
    const element = {};
    element.id = id;
    element.page = page;
    element.filled = $(`#advertisement-${id}`).children().length !== 0;
    element.maxHeight = maxHeight;
    element.portrait = portrait;
    element.column = column;
    return element;
  }

  /**
   * Adds whitespaceContainers to the end of each page except the first page (cover).
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
   * Adds advertisements to columns.
   *
   * @param {Function} done
   */
  fillColumnAdvertisements(done) {
    let containers = [];
    let i = 0;
    // get all DIV-elements with possible whitespace in columns which are at the end of a column (excluding last column)
    $('.route--blank').toArray().forEach((blank) => {
      const $blank = $(blank);
      const $next = $($blank.next());
      if ($next.length > 0) {
        const blankOffset = $blank.offset();
        const nextOffset = $next.offset();
        const blankLeft = blankOffset.left;
        const nextLeft = nextOffset.left;
        if (nextLeft > blankLeft) {
          const id = `blank-${i++}`;
          this.replaceBlankWithAdvertisement($blank, id);
          const maxHeight = this.booklet.getMaxColumnHeight(blank);
          const element = this.generateAdvertisementElement(
            id,
            last($blank.closest('.sheet').attr('id').split('-')),
            maxHeight,
            maxHeight > (process.env.APP_CONTENT_WIDTH / process.env.APP_COLUMNS) ? true : false,
            true
          );
          containers.push(element);
        }
      }
    });
    // get all DIV-elements in columns which are in the last column and have possible whitespace
    $('.routes__columns').toArray().forEach((container) => {
      const lastBlank = last($(container).children());
      if (lastBlank){
        const $lastBlank = $(lastBlank);
        const id = `blank-${i++}`;
        this.replaceBlankWithAdvertisement($lastBlank, id);
        const maxHeight = this.booklet.getMaxColumnHeight(lastBlank);
        const element = this.generateAdvertisementElement(
          id,
          last($lastBlank.closest('.sheet').attr('id').split('-')),
          maxHeight,
          maxHeight > (process.env.APP_CONTENT_WIDTH / process.env.APP_COLUMNS) ? true : false,
          true
        );
        containers.push(element);
      }
    });
    // fill advertisements in these DIV-elements
    this.fillAdvertisements(containers, 'column-advertisement', () => done());
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
      const maxHeight = $container.hasClass('advertisement-column') ? this.booklet.getMaxColumnHeight(container) : this.booklet.getMaxHeight(container);
      const element = this.generateAdvertisementElement(
        $container.attr('id'),
        last($container.closest('.sheet').attr('id').split('-')),
        maxHeight < 0 ? 0 : maxHeight,
        maxHeight > process.env.APP_CONTENT_WIDTH ? true : false,
        $container.hasClass('advertisement-column')
      );
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
    // Filter advertisements to avoid having the same advertisements next to each other
    const ads = this.advertisements.filter((ad) => ad.images.every((image) => float ? image.hashID !== hashID : true));

    // Take random advertisement from array with advertisement priorities
    ads[Math.floor((Math.random() * ads.length))].images
      .filter((image) => element.portrait ? image.origWidth < image.origHeight : image.origWidth > image.origHeight)
      .forEach((img) => {
        const photoPath = buildImageUrl(img);
        let ad;
        if (!float) {
          if (!element.filled) {
            // If image is to small, append it to the last element
            // if (parseInt(img.origHeight) + parseInt(process.env.APP_AD_MIN_HEIGHT) >= element.maxHeight) {
            if (element.column) {
              ad = areaView.advertisementColumn(element, photoPath, element.maxHeight, img.hashID);
            } else {
              ad = areaView.advertisement(element, photoPath, element.maxHeight, img.hashID);
            }
            $(`#${element.id}`).append(ad);
            element.filled = true;
            // } else {
            //   let lastElement = last(
            //     containers
            //       .filter(element => element.filled !== true)
            //       .filter(element => element.maxHeight >= process.env.APP_AD_MIN_HEIGHT)
            //   );
            //   if (element.column) {
            //     ad = areaView.advertisementColumn(element, photoPath, lastElement.maxHeight, img.hashID);
            //   } else {
            //     ad = areaView.advertisement(element, photoPath, lastElement.maxHeight, img.hashID);
            //   }
            //   $(`#${lastElement.id}`).append(ad);
            //   lastElement.filled = true;
            //   this.addAdvertisement(element, containers, float, hashID);
            // }
          }
        } else {
          ad = areaView.advertisementRight(element, photoPath, element.maxHeight, img.hashID);
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
  fillAdvertisements(containers, imgClass, done) {
    containers
      .filter(element => element.maxHeight >= process.env.APP_AD_MIN_HEIGHT)
      .sort((a, b) => { return b.maxHeight - a.maxHeight; })
      .forEach((element) => {
        this.addAdvertisement(element, containers, false);
      });

    // Wait for image loading
    const images = $(`.${imgClass}`).find('img').not('.logo');
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
   * Appends a second advertisement to a whitespace-container if the first
   * advertisement does not use more than half page-width.
   *
   * @param {Array} containers
   * @param {Function} done
   */
  fillAdditionalAdvertisements(containers, done) {
    debugger;
    containers
      .filter(element => element.maxHeight >= process.env.APP_AD_MIN_HEIGHT)
      .filter(element => element.filled)
      .filter(element => element.column === false)
      .forEach((element) => {
        $(`#${element.id}`).children().toArray().forEach((e) => {
          $(e).children().toArray().forEach((img) => {
            this.log.info(img);
            debugger;
            if (img.clientWidth < process.env.APP_CONTENT_WIDTH / 2) {
              const hashID = $(img).parent().attr('hashid');
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

  calculateAdvertisementFulfillment() {
    const totalDocumentHeight = process.env.APP_CONTENT_HEIGHT * this.booklet.countTotalPages();
    const heightToFill = totalDocumentHeight * process.env.APP_AD_AD_LEVEL;
    this.log.info('heightToFill', heightToFill);
  }

}
