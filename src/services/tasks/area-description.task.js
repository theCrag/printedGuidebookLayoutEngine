import $ from 'jquery';
import { last, cloneDeep } from 'lodash';

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

  // /**
  //  * Check if there are left over P-elements which are not in the descArray
  //  *
  //  * @param {Array} descArray
  //  * @param {Array} innerTextDesc
  //  * @param {string} delimiter
  //  */
  // checkLeftoverP(descArray, innerTextDesc, delimiter) {
  //   // Create new <p></p> for left over text
  //   if (innerTextDesc.length > 0) {
  //     let newP = $.parseHTML('<p></p>')[0];
  //     newP.innerText = innerTextDesc.join(delimiter);
  //     descArray.unshift(newP);
  //   }
  // }

  // /**
  //  * Check if there are left over UL-elements which are not in the descArray
  //  *
  //  * @param {Array} descArray
  //  * @param {Array} uls
  //  */
  // checkLeftoverUL(descArray, uls) {
  //   // Create new <ul></ul> for left over bullet point entries
  //   if (uls.length > 0) {
  //     let newUl = $.parseHTML('<ul></ul>')[0];
  //     uls.forEach(li => newUl.append(li));
  //     descArray.unshift(newUl);
  //   }
  // }

  // /**
  //  * Check if there are left over OL-elements which are not in the descArray
  //  *
  //  * @param {Array} descArray
  //  * @param {Array} ols
  //  */
  // checkLeftoverOL(descArray, ols) {
  //   // Create new <ul></ul> for left over bullet point entries
  //   if (ols.length > 0) {
  //     let newUl = $.parseHTML('<ol></ol>')[0];
  //     ols.forEach(li => newUl.append(li));
  //     descArray.unshift(newUl);
  //   }
  // }

  // /**
  //  * Check if there are left over elements which are not in the descArray
  //  *
  //  * @param {Array} descArray
  //  * @param {Array} innerTextDesc
  //  * @param {Array} uls
  //  * @param {Array} ols
  //  * @param {string} delimiter
  //  * @param {string} currentType
  //  */
  // checkLeftovers(descArray, innerTextDesc, uls, ols, delimiter, type) {
  //   switch (type) {
  //     case 'P':
  //       this.checkLeftoverP(descArray, innerTextDesc, delimiter);
  //       break;
  //     case 'UL':
  //       this.checkLeftoverUL(descArray, uls);
  //       break;
  //     case 'OL':
  //       this.checkLeftoverOL(descArray, ols);
  //       break;
  //     default:
  //       break;
  //   }
  // }

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
   * @param {HTMLElement} page
   * @param {Function} done
   */
  eliminateWidow(lastElement, areaId, index, origLastElement, page, done) {
    if (!$(lastElement).prev().hasClass('photo')) {
      // If there is a widow, add an image
      getPhotos(areaId, (photos) => {
        const photoPath = buildImageUrl(photos[Math.floor((Math.random() * photos.length))]);
        const photo = areaView.photo(areaId, index, photoPath);
        const maxHeight = this.booklet.getMaxHeight(lastElement);
        lastElement.remove();
        this.booklet.addContent(photo, () => this.booklet.addContent(origLastElement, () => {
          $(`#photo-img-${areaId}-${index}`).css('max-height', `${maxHeight}px`);
          this.validate(page, done);
        }));
      });
    } else {
      // If photo is already inserted before, make photo wider and add content to new page
      $(lastElement).prev().removeClass('photo');
      $(lastElement).prev().addClass('photo-full');
      lastElement.remove();
      this.booklet.addPage();
      this.booklet.addContent(origLastElement, () => this.validate(page, done));
    }
  }

  // /**
  //  * Cleanup if the description block is empty now
  //  *
  //  * @param {Object} lastElement
  //  */
  // cleanupLastElement(lastElement){
  //   if ($(lastElement).children().length === 0) {
  //     $(lastElement).remove();
  //   }
  // }

  // /**
  //  * Validates if the descriptions matches on the current page if not, it does
  //  * split the description blocks. Split is done by a predefined delimiter for
  //  * P-elements. For UL-elements it splits by the LI-elements. The function
  //  * validates as well if there are a widow on the new page, if so it inserts
  //  * an image before.
  //  *
  //  * @param {HTMLElement} page
  //  * @param {Function} done
  //  */
  // validate(page, done) {
  //   const lastElement = last(page.children());
  //   const origLastElement = $(lastElement).clone();

  //   if (!this.booklet.isElementInsideCurrentSheet(lastElement)) {

  //     const areaId = $(lastElement).attr('id').split('-')[1];
  //     const index = $(lastElement).attr('id').split('-')[2];
  //     let descArray = [];
  //     let innerTextDesc = [];
  //     let order = [];
  //     let uls = [];
  //     let ols = [];
  //     const delimiter = process.env.APP_SPLIT_DESCRIPTIONS_BY.substr(1).slice(0, -1);

  //     // Remove the last element until the text fits in page
  //     while (!this.booklet.isElementInsideCurrentSheet(lastElement)) {
  //       const lastChild = last($(lastElement).children());
  //       if (!(order[0] === lastChild.tagName)) {
  //         order.unshift(lastChild.tagName);
  //       }

  //       switch (lastChild.tagName) {
  //         // How to proceed when the element is a <p></p>
  //         case 'P':
  //           this.log.info('lastChild',$(lastChild).html());
  //           if ($(lastChild).children().length === 0){
  //             // Check if innerText exists, when not remove the element
  //             if (lastChild.innerText === '') {
  //               lastChild.remove();
  //               // Check if there is some text exported from the removed <p></p>,
  //               // if yes, create a new P and add to array
  //               this.checkLeftoverP(descArray, innerTextDesc, delimiter);
  //               innerTextDesc = [];
  //             } else {
  //               // If innerText exists, remove the last word
  //               let oldDesc = $(lastChild).html().split(delimiter);
  //               innerTextDesc.unshift(oldDesc.pop());
  //               lastChild.innerText = oldDesc.join(delimiter);
  //             }
  //           } else {
  //             const lastSubChild = last($(lastChild).children());
  //             this.log.info('subChildren', $(lastChild).children());
  //             descArray.unshift(lastSubChild);
  //             lastChild.remove();
  //           }

  //           break;

  //         case 'UL': {
  //           // Removes single <li></li> elements until it fits on page.
  //           let li = last($(lastChild).children());
  //           uls.unshift(li);
  //           li.remove();
  //           // Removes empty <ul></ul> elements
  //           if ($(lastChild).children().length === 0) {
  //             lastChild.remove();
  //             this.checkLeftoverUL(descArray, uls);
  //             uls = [];
  //           }
  //           break;
  //         }

  //         case 'OL': {
  //           // Removes single <li></li> elements until it fits on page.
  //           let li = last($(lastChild).children());
  //           ols.unshift(li);
  //           li.remove();
  //           // Removes empty <ul></ul> elements
  //           if ($(lastChild).children().length === 0) {
  //             lastChild.remove();
  //             this.checkLeftoverUL(descArray, ols);
  //             ols = [];
  //           }
  //           break;
  //         }

  //         default:
  //           // Move the whole element on new page
  //           descArray.unshift(lastChild);
  //           lastChild.remove();
  //           break;
  //       }

  //       // Move the title, if this is the lastElement
  //       const lastChildTitle = last($(lastElement).children());
  //       if (lastChildTitle.tagName === 'H2') {
  //         descArray.unshift(lastChildTitle);
  //         lastChildTitle.remove();
  //       }
  //     }
  //     order.forEach((type) => this.checkLeftovers(descArray, innerTextDesc, uls, delimiter, type));

  //     this.cleanupLastElement(lastElement);

  //     let html = $.parseHTML(areaView.emptyDescription(areaId, index));
  //     descArray.map((e) => $(html).append(e));
  //     if ((last(html).innerText.length) < process.env.APP_WIDOW_BOUNDARY) {
  //       this.eliminateWidow(html, lastElement, areaId, index, origLastElement, page, done);
  //     } else {
  //       // If there is no widow, add content to new page
  //       this.booklet.addPage();
  //       this.booklet.addContent(html, done);
  //     }

  //   } else {
  //     done();
  //   }
  // }
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
        if ($(lastElement).children().length === 0) {
          $(lastElement).remove();
          lastElement = last(page.children());
        }
        const lastChild = last($(lastElement).children());
        const $lastChild = $(lastChild);
        const htmlTag = $lastChild.prop('tagName');
        if ($lastChild.children().length === 0 && $lastChild.html().trim() === '') {
          if (tagStarted) {
            tagStarted = false;
          }
          $lastChild.remove();
        } else {
          if (!tagStarted) {
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

              if (last(texts).includes('</')) {
                if ((last(texts).match(/</g) || []).length < 2) {
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
              if (li) {
                if (htmlTag === 'OL') {
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
      if (last(html).innerText.length < process.env.APP_WIDOW_BOUNDARY) {
        // TODO: widows not tested!
        this.eliminateWidow(lastElement, areaId, index, origLastElement, page, done);
      }

      this.booklet.addPage();
      this.booklet.addContent(html, (page) => this.validate(page, done));

    } else {
      done();
    }
  }

}
