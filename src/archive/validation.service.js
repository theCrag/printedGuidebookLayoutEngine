export const isElementInsideCurrentSheet = (element) => {
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
};

export const validateRoutes = (area, page, routesContainer, content, func, index, done) => {
  const areSomeRoutesOutsideTheSheet = routesContainer.find('.topo, .route')
    .children()
    .toArray()
    .some(c => !isElementInsideCurrentSheet(c));

  if (areSomeRoutesOutsideTheSheet) {
    if ('addRouteMainTopo' === func) {
      routesContainer.remove();
      removePossibleRouteZombies();
      addPage();
      addRoutesContainer(area)(() => {
        addRouteMainTopo(area, content)(done);
      });

    } else {
      const lastElement = routesContainer.find('.route').not('.route--blank').last();
      lastElement.remove();
      removePossibleRouteZombies();
      addPage();
      addRoutesContainer(area)(() => {
        const secondLastElement = routesContainer.find('.route').not('.route--blank').last();
        const $secondLastElement = $(secondLastElement);
        if ($secondLastElement.hasClass('route--topo')) {
          $secondLastElement.remove();
          addRouteItem(area, $secondLastElement.html(), index - 1)(() => {
            addRouteItem(area, content, index)(done);
          });

        } else {
          addRouteItem(area, content, index)(done);
        }
      });
    }

  } else {
    done();

  }
};

export const validatePage = (area, page, content, done) => {
  const lastElement = last(page.children());

  if (!isElementInsideCurrentSheet(lastElement)) {

    const $lastElement = $(lastElement);
    const id = $lastElement.attr('id');

    if (id) {
      if (id.startsWith('description')) {
        return validateDescription(area, lastElement, page, content, done);
      }

      if (id.startsWith('geometry')) {
        return validateGeometry(area, lastElement, page, content, done);
      }
    }

    // move last element to new page
    lastElement.remove();
    addPage();
    addContent(area, content)(done);

  } else {
    done();
  }
};

export const validateArea = (area, reset) => (done) => {
  const routes = $(`.routes.area-${area.id}`);
  if (routes.length > 1) {
    log.info('validateArea', area, routes);

    // Check if topo got missing on a right page
    const isFirstRoutesPageRight = routes.first().closest('.sheet').hasClass('sheet--right');
    if (isFirstRoutesPageRight && !area.routesNeedToStartOnALeftPage) {
      if (countRouteItems(routes.first()) === 1) {
        area.routesNeedToStartOnALeftPage = true;
        return reset();
      }
    }

    // Validate if the last route of a topo is in sight, otherwise start with the topo on
    // left top page.
    let restartRendering = false;
    area.routeItems = area.routeItems.map(item => {
      if (item.type === 'Topo') {

        if (item.routesResponsible.length > 0) {
          const topoElement = $(`#topo-${item.id}`);
          const topoPageElement = topoElement.closest('.sheet');
          const topoPageElementIsALeftPage = topoPageElement.hasClass('sheet--left');
          const pageElements = [topoPageElement];

          if (topoPageElementIsALeftPage) {
            const idPagePairs = topoPageElement.attr('id').split('-');
            const nextTopoPage = $(`#page-${parseInt(first(idPagePairs), 10) + 1}`);
            pageElements.push(nextTopoPage);

          }

          // const pages = $(pageElements.map(e => `#${e.attr('id')}`).join(', '));
          const lastRouteInSight = topoPageElement.find(`#route-${area.id}-${first(item.routesResponsible)}`);

          if (lastRouteInSight.length === 0 && !item.startOnLeftPage && !restartRendering) {
            item.startOnLeftPage = true;
            restartRendering = true;

          }
        }

      }
      return item;
    });

    if (restartRendering) {
      return reset();
    }

    done();
  } else {
    done();
  }
};

export const validateGeometry = (area, lastElement, page, content, done) => {

  let secondLastIsTitle = false;
  let secondLastElement = null;
  secondLastElement = page.children()[page.children().length - 2];
  if ($(secondLastElement).attr('id')) {
    if ($(secondLastElement).attr('id') === 'title-' + area.id) {
      secondLastIsTitle = true;
    }
  }

  // move last element to new page
  lastElement.remove();
  addPage();

  // move title or last element to new page
  if (secondLastIsTitle) {
    secondLastElement.remove();
    addContent(area, secondLastElement)(() => addContent(area, content)(done));
  } else {
    addContent(area, content)(done);
  }
};

export const validateDescription = (area, lastElement, page, content, done) => {
  const areaId = $(lastElement).attr('id').split('-')[1];
  const index = $(lastElement).attr('id').split('-')[2];
  let descArray = [];
  let innerTextDesc = [];
  const delimiter = process.env.APP_SPLIT_DESCRIPTIONS_BY.substr(1).slice(0, -1);

  // remove the last word until the text fits in page
  while (!isElementInsideCurrentSheet(lastElement)) {
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
  addPage();
  let html = $.parseHTML(areaView.emptyDescription(areaId, index));
  descArray.map((e) => $(html).append(e));
  addContent(area, html)(done);
  // }
};
