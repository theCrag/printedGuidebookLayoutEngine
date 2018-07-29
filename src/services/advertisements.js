import $ from 'jquery';
import { last } from 'lodash';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';
import { getAds, buildImageUrl, getPhotos } from './api.service';

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
  replaceBlankWithAdvertisement(element, id) {
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
  generateAdvertisementElement(id, page, maxHeight, portrait, column) {
    const element = {};
    element.id = id;
    element.page = page;
    element.filled = $(`#advertisement-${id}`).children().length !== 0;
    element.hasContent = $(`#${id}`).children().length !== 0;
    element.maxHeight = maxHeight;
    element.portrait = portrait;
    element.column = column;
    element.hasTwo = $(`#advertisement-${id}`).hasClass('advertisement-two');
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
      if (lastBlank) {
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
   * @param {boolean} float
   */
  addAdvertisement(element, float) {
    const hasHashes = $(`#page-${element.page}`).find('div[hashid]').toArray();
    const hashIds = hasHashes.map(img => $(img).attr('hashid'));

    // Filter advertisements to avoid having the same advertisements next to each other
    let ads = this.advertisements;
    if (hashIds.length > 0) {
      for (let i = 0; i < hashIds.length; i++) {
        ads = ads.filter((ad) => ad.images.every((image) => image.hashID !== hashIds[i]));
      }
    }

    // if all advertisements are filtered out, it is not possible to not have duplicate advertisements
    if (ads.length === 0){
      ads = this.advertisements;
    }

    // Take random advertisement from array with advertisement priorities
    ads[Math.floor((Math.random() * ads.length))].images
      .filter((image) => element.portrait ? image.origWidth < image.origHeight : image.origWidth > image.origHeight)
      .forEach((img) => {
        const photoPath = buildImageUrl(img);
        let ad;
        if (!float) {
          if (!element.filled) {
            if (element.column) {
              ad = areaView.advertisementColumn(element, photoPath, element.maxHeight, img.hashID);
            } else {
              ad = areaView.advertisement(element, photoPath, element.maxHeight, img.hashID);
            }
            $(`#${element.id}`).append(ad);
            element.filled = true;
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
        this.addAdvertisement(element, false);
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
    containers
      .filter(element => element.maxHeight >= process.env.APP_AD_MIN_HEIGHT)
      .filter(element => element.filled)
      .filter(element => element.column === false)
      .forEach((element) => {
        $(`#${element.id}`).children().toArray().forEach((e) => {
          $(e).children().toArray().forEach((img) => {
            if (img.clientWidth < process.env.APP_CONTENT_WIDTH / 2) {
              this.addAdvertisement(element, true);
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

  /**
   * Returns an Array with the filled whitespace containers
   * including the next and previous element for each element
   *
   * @param {Array} containers
   * @returns {Array} filledContainers
   */
  getAdvertisements(containers) {
    const filledContainers = containers.filter(e => e.filled);
    for (let i = 0; i < filledContainers.length; i++) {
      if (filledContainers[i - 1]) {
        filledContainers[i].prev = filledContainers[i - 1];
      } else {
        filledContainers[i].prev = null;
      }
      if (filledContainers[i + 1]) {
        filledContainers[i].next = filledContainers[i + 1];
      } else {
        filledContainers[i].next = null;
      }
      filledContainers[i].distance = null;
      filledContainers[i].skipped = $(`#${filledContainers[i].id}`).hasClass('keep');
    }
    return (filledContainers);
  }

  /**
   * Replaces an advertisement with an image. Inserts more images if
   * there is enough space.
   *
   * @param {string} treeID
   * @param {number} index
   * @param {Object} element
   * @param {Function} done
   * @param {boolean} float
   */
  insertFillImage(treeID, index, element, done, float = null) {
    let img = `#photo-img-${treeID}-${index}`;
    const $e = $(`#${element.id}`);
    const nextIndex = index + 1;

    getPhotos(treeID, (photos) => {
      if (photos.length > index) {
        const photoPath = buildImageUrl(photos[index]);
        let photo;
        // if there are two advertisements, remove the right one as well
        if (element.hasTwo) {
          $(`#advertisement-${element.id}-right`).remove();
        }
        $(`#advertisement-${element.id}`).remove();
        if (float) {
          $e.children().toArray().forEach(img => {
            $(img).removeClass('photo-full');
            $(img).addClass('photo-two');
            photo = areaView.photoTwo(treeID, index, photoPath);
          });
        } else {
          photo = areaView.photo(treeID, index, photoPath);
        }
        $e.append(photo);
        const image = $(img);
        image.css('max-height', `${element.maxHeight}px`);

        // Wait for image loading
        if (image.length > 0) {
          image.on('load', () => {
            const whitespace = image.closest('.whitespace');
            let maxHeight = 0;
            if (element.column){
              maxHeight = this.booklet.getMaxColumnHeight(whitespace) - whitespace.height();
            } else {
              maxHeight = this.booklet.getMaxHeight(whitespace) - whitespace.height();
            }
            const totalImagesWidth = whitespace.children().toArray().map(e => $(e).children().toArray()).map(img => $(img).width()).reduce((a,v) => a + v);
            // if image is loaded, check if there is enough space for an additional image
            if (maxHeight > process.env.APP_AD_MIN_HEIGHT) {
              if (whitespace.hasClass('whitespace__container')) {
                whitespace.removeClass('whitespace__container');
                whitespace.addClass('whitespace__col');
              }
              element.maxHeight = maxHeight;
              this.insertFillImage(treeID, nextIndex, element, (i) => done(i));
            } else if (totalImagesWidth < process.env.APP_CONTENT_WIDTH / 2 && whitespace.children().length < process.env.APP_COLUMNS) {
              this.insertFillImage(treeID, nextIndex, element, (i) => done(i), true);
            } else {
              done(nextIndex);
            }
          });
        } else {
          done(nextIndex);
        }
      } else {
        done(null);
      }
    });
  }

  /**
   * Recursive function to replace advertisements with fill images
   * until it has the correct fulfillment level
   *
   * @param {number} heightToFill
   * @param {string} treeID
   * @param {number} index
   * @param {number} distance
   * @param {Function} done
   */
  replaceAdvertisement(heightToFill, treeID, index, distance, done) {
    const ads = this.getAdvertisements(this.getWhitespaceContainers());
    let fill = null;
    if (this.getHeightOfAdsFilledWhitespaces(this.getWhitespaceContainers()) > heightToFill) {
      const as = ads
        .filter(a => a.next != null)
        .filter(a => a.prev != null)
        .filter(a => a.skipped !== true);
      as.forEach(a => a.distance = parseInt(a.next.page - a.page, 10) + parseInt(a.page - a.prev.page, 10));
      as.sort((a, b) => { return a.distance - b.distance; });
      if (as.length > 0) {
        fill = as[0];
        if (this.getHeightOfAdsFilledWhitespaces(this.getWhitespaceContainers()) - ($(`#advertisement-${fill.id}`).height() / 2) >= heightToFill){
          if (fill) {
            this.insertFillImage(treeID, index, fill, (index) => {
              if (index !== null) {
                this.replaceAdvertisement(heightToFill, treeID, index, distance, done);
              } else {
                done();
              }
            });
          } else {
            this.replaceAdvertisement(heightToFill, treeID, index, distance + 1, done);
          }
        } else {
          fill.skipped = true;
          $(`#${fill.id}`).addClass('keep');
          this.replaceAdvertisement(heightToFill, treeID, index, distance, done);
        }
      } else {
        this.log.info('advertisements', ads);
        done();
      }
    } else {
      this.log.info('advertisements', ads);
      done();
    }
  }

  /**
   * Checks if advertisements are fulfilled, if there are to many advertisements
   * the advertisement get replaced by an fill image.
   *
   * @param {string} treeID
   * @param {Function} done
   */
  checkAdvertisementFulfillment(treeID, done) {
    const totalDocumentHeight = parseInt(process.env.APP_CONTENT_HEIGHT * this.booklet.countTotalPages(), 10);
    const heightToFill = parseInt(totalDocumentHeight / 100 * process.env.APP_AD_AD_LEVEL, 10);
    if (this.getHeightOfFilledWhiteSpaces(this.getWhitespaceContainers()) > heightToFill) {
      this.replaceAdvertisement(heightToFill, treeID, 0, 0, () => {
        done();
      });
    } else {
      this.log.warn('too little whitespace to fulfill advertisements');
      done();
    }
  }

  /**
   * Gets the height of all the whitespace of the document.
   *
   * @param {Array<Object>} allWhitespaces
   * @returns {Number} Amount whitespace pixel.
   */
  getHeightOfAllWhiteSpaces(allWhitespaces) {
    return allWhitespaces.length > 0
      ? allWhitespaces.map(a => a.maxHeight).reduce((a, v) => a + v)
      : 0;
  }

  /**
   * Gets the height of all the whitespace of the document, which are filled
   * with advertisement or a image.
   *
   * @param {Array<Object>} allWhitespaces
   * @returns {Number} Amount whitespace pixel.
   */
  getHeightOfFilledWhiteSpaces(allWhitespaces) {
    return this.getHeightOfAllWhiteSpaces(allWhitespaces.filter(a => a.hasContent));
  }

  /**
   * Gets the height of all the whitespace of the document, which are filled
   * with advertisement.
   *
   * @param {Array<Object>} allWhitespaces
   * @returns {Number} Amount whitespace pixel.
   */
  getHeightOfAdsFilledWhitespaces(allWhitespaces) {
    return this.getHeightOfAllWhiteSpaces(allWhitespaces.filter(a => a.filled));
  }
}
