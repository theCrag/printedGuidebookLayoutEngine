import $ from 'jquery';
import { last, cloneDeep } from 'lodash';

import * as areaView from '../../views/area.view';
import { Task } from './task';

export class AreaDescriptionTask extends Task {

  constructor(booklet, area, index) {
    super(booklet, area, areaView.description(cloneDeep(area), index));

    this.index = index;
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

      // add new page and append previously removed elements
      // let desc = descArray.map((e) => $(desc).append(e));
      // log.info(descArray);
      // if (desc.length < process.env.APP_WIDOW_BOUNDARY) {
      //   getPhotos(area.id, (photos) => {
      //     const photoPath = buildImageUrl(photos[0]);
      //     const photo = areaView.photo(area, descId, photoPath);
      //     lastElement.remove();
      //     addContent(area, photo)(() => addContent(area, lastElement)(() => appendToLastDescription(area, desc)(done)));
      //   });
      // } else {
      this.booklet.addPage();
      let html = $.parseHTML(areaView.emptyDescription(areaId, index));
      descArray.map((e) => $(html).append(e));
      this.booklet.addContent(html, done);
      // }

    } else {
      done();
    }
  }

}
