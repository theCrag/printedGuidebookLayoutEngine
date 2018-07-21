import $ from 'jquery';
import { last, cloneDeep, first } from 'lodash';

import * as areaView from '../../views/area.view';
import { Task } from './task';
import { createLogger } from '../../utils/logger';
import { getPhotos, buildImageUrl } from '../api.service';

/**
 * Adds a description of an area to the DOM.
 */
export class AreaDescriptionTask extends Task {

  constructor(booklet, area, index) {
    super(booklet, area, areaView.description(cloneDeep(area), index));

    this.index = index;
    this.log = createLogger('AreaDescriptionTask');
  }

  /**
   * Simply adds the html template to the current page.
   *
   * @param {Function} done
   */
  run(done) {
    this.booklet.addContent(this.html, (page) => this.validate(page, done));
  }

  /**
   * Adds a description block or part of a description block to the page.
   * Recognized widows and tries to eliminate them by adding an image
   * before the current description block. If image is already inserted,
   * but widow still exists, it makes the image wider.
   *
   * @param {HTMLElement} lastElement
   * @param {number} areaId
   * @param {number} index
   * @param {HTMLElement} origLastElement
   * @param {Function} done
   */
  eliminateWidow(lastElement, areaId, index, origLastElement, done) {
    debugger;
    if (!$(lastElement).prev().hasClass('photo')) {
      // If there is a widow, add an image
      getPhotos(areaId, (photos) => {
        debugger;
        const photoPath = buildImageUrl(photos[Math.floor((Math.random() * photos.length))]);
        const photo = areaView.photo(areaId, index, photoPath);
        const maxHeight = this.booklet.getMaxHeight(lastElement);
        lastElement.remove();
        this.booklet.addContent(photo, () => this.booklet.addContent(origLastElement, (page) => {
          $(`#photo-img-${areaId}-${index}`).css('max-height', `${maxHeight}px`);
          done(page);
        }));
      });
    } else {
      // If photo is already inserted before, make photo wider and add content to new page
      $(lastElement).prev().removeClass('photo');
      $(lastElement).prev().addClass('photo-full');
      lastElement.remove();
      this.booklet.addPage();
      this.booklet.addContent(origLastElement, (page) => done(page));
    }
  }

  /**
   * Validates if the descriptions matches on the current page if not, it does
   * split the description blocks. Split is done by a predefined delimiter for
   * P-elements. For UL-elements it splits by the LI-elements. The function
   * validates as well if there are a widow on the new page, if so it inserts
   * an image before.
   *
   * @param {HTMLElement} page
   * @param {Function} done
   */
  validate(page, done) {
    let lastElement = last(page.children());
    const origLastElement = $(lastElement).clone();
    let tagStarted = false;

    if (!this.booklet.isElementInsideCurrentSheet(lastElement)) {
      const areaId = $(lastElement).attr('id').split('-')[1];
      const index = $(lastElement).attr('id').split('-')[2];
      const delimiter = process.env.APP_SPLIT_DESCRIPTIONS_BY.substr(1).slice(0, -1);
      let destination = [];

      // Remove the last element until the text fits in page
      while (!this.booklet.isElementInsideCurrentSheet(lastElement)) {
        if ($(lastElement).children().length === 0){
          $(lastElement).remove();
          lastElement = last(page.children());
        }
        const lastChild = last($(lastElement).children());
        const $lastChild = $(lastChild);
        const htmlTag = $lastChild.prop('tagName');
        if ($lastChild.children().length === 0 && $lastChild.html().trim() === ''){
          if (tagStarted){
            tagStarted = false;
          }
          $lastChild.remove();
        } else {
          if (!tagStarted){
            tagStarted = true;
            destination.unshift(`</${htmlTag}>`);
          } else {
            destination.shift();
          }
          switch (htmlTag) {
            // How to proceed when the element is a <p></p>
            case 'P':
              let current = $lastChild.html().split(delimiter);
              let texts = [];
              texts.unshift(current.pop().trim());
              // if ($lastChild.html().includes('Hitman')){
              //   debugger;
              // }
              if (last(texts).includes('</')){
                if ((last(texts).match(/</g) || []).length < 2){
                  do {
                    texts.unshift(current.pop().trim());
                  } while ((texts.join(delimiter).match(/</g) || []).length < 2);
                }
              }
              destination.unshift(texts.join(delimiter));
              $lastChild.html(current.join(delimiter));
              break;

            case 'OL':
            case 'UL':
              // Removes single <li></li> elements until it fits on page.
              const li = last($(lastChild).children());
              const $li = $(li);
              if (li){
                if (htmlTag === 'OL'){
                  destination.unshift(`<li value="${$(lastChild).children().length}">${$li.prop('innerHTML')}</li>`);
                } else {
                  destination.unshift($li.prop('outerHTML'));
                }
                li.remove();
              } else {
                $lastChild.remove();
              }
              break;

            default:
              // Move the whole element on new page
              destination.unshift($lastChild.html());
              $lastChild.remove();
              break;
          }
          destination.unshift(`<${htmlTag}>`);
        }
      }

      let html = $.parseHTML(areaView.emptyDescription(areaId, index));
      $(html).html(destination.join(delimiter));
      debugger;
      if (process.env.APP_WIDOW_AUTO_AVOID === 'true' && last(html).innerText.length < process.env.APP_WIDOW_BOUNDARY) {
        this.eliminateWidow(lastElement, areaId, index, origLastElement, (page) => this.validate(page, done));
      } else {
        this.booklet.addPage();
        this.booklet.addContent(html, (page) => this.validate(page, done));
      }
    } else {
      done();
    }
  }

}
