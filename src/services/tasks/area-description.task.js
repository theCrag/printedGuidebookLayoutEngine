import $ from 'jquery';
import { last, cloneDeep } from 'lodash';

import * as areaView from '../../views/area.view';
import { Task } from './task';
import { createLogger } from '../../utils/logger';
import { getPhotos, buildImageUrl } from '../api.service';

export class AreaDescriptionTask extends Task {

  constructor(booklet, area, index) {
    super(booklet, area, areaView.description(cloneDeep(area), index));

    this.index = index;
    this.log = createLogger('AreaDescriptionTask');
  }

  run(done) {
    this.booklet.addContent(this.html, (page) => this.validate(page, done));
  }

  validate(page, done) {
    const lastElement = last(page.children());

    if (!this.booklet.isElementInsideCurrentSheet(lastElement)) {

      const areaId = $(lastElement).attr('id').split('-')[1];
      const index = $(lastElement).attr('id').split('-')[2];
      let descArray = [];
      let innerTextDesc = [];
      let uls = [];
      const delimiter = process.env.APP_SPLIT_DESCRIPTIONS_BY.substr(1).slice(0, -1);

      // remove the last word until the text fits in page
      while (!this.booklet.isElementInsideCurrentSheet(lastElement)) {
        const lastChild = last($(lastElement).children());

        switch (lastChild.tagName) {
          // how to proceed when the element is a <p></p>
          case 'P':
            // check if innerText exists, when not remove the element
            if (lastChild.innerText === '') {
              lastChild.remove();
              // check if there is some text exported from the removed <p></p>, if yes, create a new P and add to array
              if (innerTextDesc.length > 0) {
                let newP = $.parseHTML('<p></p>')[0];
                newP.innerText = innerTextDesc.join(delimiter);
                descArray.unshift(newP);
                innerTextDesc = [];
              }
            } else {
              // if innerText exists, remove the last word
              let oldDesc = lastChild.innerText.split(delimiter);
              innerTextDesc.unshift(oldDesc.pop());
              lastChild.innerText = oldDesc.join(delimiter);
            }
            break;

          case 'UL': {
            // removes single <li></li> elements until it fits on page.
            let li = last($(lastChild).children());
            uls.unshift(li);
            li.remove();
            // removes empty <ul></ul> elements
            if ($(lastChild).children().length === 0){
              $(lastChild).remove();
            }
            break;
          }

          default:
            // move the whole element on new page
            descArray.unshift(lastChild);
            lastChild.remove();
            break;
        }

        // move the title, if this is the lastElement
        const lastChildTitle = last($(lastElement).children());
        if (lastChildTitle.tagName === 'H2') {
          descArray.unshift(lastChildTitle);
          lastChildTitle.remove();
        }
      }

      // cleanup if the description block is empty now
      if ($(lastElement).children().length === 0) {
        $(lastElement).remove();
      }

      // create new <p></p> for left over text
      if (innerTextDesc.length > 0) {
        let newP = $.parseHTML('<p></p>')[0];
        newP.innerText = innerTextDesc.join(delimiter);
        descArray.unshift(newP);
      }

      //create new <ul></ul> for left over bullet point entries
      if (uls.length > 0){
        let newUl = $.parseHTML('<ul></ul>')[0];
        uls.forEach(li => newUl.append(li));
        descArray.unshift(newUl);
      }

      // add new page and append previously removed elements
      let html = $.parseHTML(areaView.emptyDescription(areaId, index));
      descArray.map((e) => $(html).append(e));
      if ((last(html).innerText.length) < process.env.APP_WIDOW_BOUNDARY){
        // if there is a widow, add an image
        getPhotos(areaId, (photos) => {
          const photoPath = buildImageUrl(photos[Math.floor((Math.random() * photos.length))]);
          const photo = areaView.photo(areaId, index, photoPath);
          const maxHeight = parseInt(this.booklet.getMaxHeight(lastElement));
          lastElement.remove();
          descArray.map((e) => lastElement.append(e));
          this.booklet.addContent(photo, () => this.booklet.addContent(lastElement, () => {
            $(`#photo-img-${areaId}-${index}`).css('max-height', `${maxHeight}px`);
            this.validate(page, done);
          }));
        });
      } else {
        // if there is no widow, add content
        this.booklet.addPage();
        this.booklet.addContent(html, done);
      }
    } else {
      done();
    }
  }

}
