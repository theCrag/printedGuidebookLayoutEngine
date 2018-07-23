import $ from 'jquery';
import { last } from 'lodash';

import { Task } from './task';
import * as areaView from '../../views/area.view';

/**
 * Adds a route item, which could be a route or a topo image, to
 * routes container of the current page in the booklet.
 */
export class RoutesItemTask extends Task {

  constructor(booklet, area, index, body) {
    if (body === undefined) {
      super(booklet, area, areaView.routeItem(area.routeItems[index], area.id, index));
    } else {
      super(booklet, area, areaView.emptyRouteItem(area.routeItems[index], area.id, body));
    }
    this.index = index;
  }

  /**
   * Simply adds the html template to the current page.
   *
   * @param {Function} done
   */
  run(done) {
    this.booklet.routes.addRouteItem(this.area, this.html, (page, routesContainer) => this.validate(page, routesContainer, done));
  }

  /**
   * Checks the DOM if some routes are outside of the defined
   * page border.
   *
   * @param {HTMLElement} routesContainer
   * @returns {boolean} Are routes over the page border.
   */
  areSomeRoutesOutsideTheSheet(routesContainer) {
    return routesContainer //.find('.topo, .route')
      .children()
      .toArray()
      .some(c => !this.booklet.isElementInsideCurrentSheet(c));
  }

  /**
   * It validates if any route of the current routes container is
   * outside of the page. If this is the case, then it will remove
   * the last route element and add it to a new page with a new routes
   * container. However, if the second last element is a topo image it
   * will also be placed on the new page.
   *
   * @param {HTMLElement} page
   * @param {HTMLElement} routesContainer
   * @param {Function} done
   */
  validate(page, routesContainer, done) {
    if (this.areSomeRoutesOutsideTheSheet(routesContainer)) {

      const lastElement = routesContainer.find('.route').not('.route--blank').last();
      if (lastElement.hasClass('route__description')) {
        const delimiter = process.env.APP_SPLIT_DESCRIPTIONS_BY.substr(1).slice(0, -1);
        let newText = [];

        let moveWholeItem = false;

        do {
          const html = lastElement.find('.route__body').html();
          if (html.length !== 0) {
            const parts = html.split(delimiter).filter(h => h.length > 0);
            newText.unshift(last(parts));
            parts.pop();
            lastElement.find('.route__body').html(parts.join(delimiter));
          } else {
            moveWholeItem = true;
            lastElement.find('.route__body').html(newText.join(delimiter));
            this.moveLastRouteItemToNewPage(lastElement, routesContainer, done);
          }

        } while (this.areSomeRoutesOutsideTheSheet(routesContainer));

        if (!moveWholeItem) {
          this.booklet.addPage();
          this.booklet.routes.addRoutesContainer(this.area, () => {
            const task = new RoutesItemTask(this.booklet, this.area, this.index, newText.join(delimiter));
            task.run(done);
          });
        }

      } else {
        this.moveLastRouteItemToNewPage(lastElement, routesContainer, done);
      }

    } else {
      done();

    }
  }

  /**
   * Moves the whole given route item to the next page in a new
   * routes container.
   *
   * @param {HTMLElement} lastElement
   * @param {HTMLElement} routesContainer
   * @param {Function} done
   */
  moveLastRouteItemToNewPage(lastElement, routesContainer, done) {
    lastElement.remove();
    this.booklet.routes.removePossibleRouteZombies();
    this.booklet.addPage();

    this.booklet.routes.addRoutesContainer(this.area, () => {
      const secondLastElement = routesContainer.find('.route').not('.route--blank').last();
      const $secondLastElement = $(secondLastElement);

      // Check if the second last element is a topo image.
      if ($secondLastElement.hasClass('route--topo')) {
        $secondLastElement.remove();
        this.booklet.routes.addRouteItem(this.area, $secondLastElement.html(), () => {
          this.run(done);
        });

      } else {
        this.run(done);
      }

    });
  }

}
