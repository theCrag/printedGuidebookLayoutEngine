import $ from 'jquery';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';

/**
 * All the routes related DOM manipulation are defined here.
 */
export class Routes {

  constructor(booklet) {
    this.booklet = booklet;
    this.routeContainerCounter = 0;

    this.log = createLogger('Routes');
  }

  /**
 * Adds a full width topo image before the upcoming routes.
 *
 * @param {string} html
 * @param {Function} done
 */
  addRouteMainTopo(html, done) {
    const page = this.booklet.getCurrentPage();
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
    const page = this.booklet.getCurrentPage();
    let routesContainer = page.find('.routes').last();
    if (routesContainer.length <= 0) {
      this.addRoutesContainer(area, () => {
        routesContainer = page.find('.routes').last();
        this.addRoutesToContainer(page, routesContainer, html, (page, routesContainer) => {
          done(page, routesContainer);
        });
      });
    } else {
      this.addRoutesToContainer(page, routesContainer, html, (page, routesContainer) => {
        done(page, routesContainer);
      });
    }
  }

  /**
 * Adds a route item to the container and verifies if the appended
 * element is image, so it can hold until the image is fully loaded in the DOM.
 *
 * @param {HTMLElement} page
 * @param {HTMLElement} routesContainer
 * @param {string} html
 * @param {Function} done
 */
  addRoutesToContainer(page, routesContainer, html, done) {
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
    this.booklet.addContent(areaView.routesContainer(area.id, this.routeContainerCounter, process.env.APP_COLUMNS), done);
    this.routeContainerCounter = this.routeContainerCounter + 1;
  }

  /**
   * Due to the optimization work in can happen that some
   * empty route containers lay in the DOM. So this method
   * remove those mentioned containers.
   */
  removePossibleRouteZombies() {
    // Remove possible routes zombies
    const routes = this.booklet.getCurrentPage().children('.routes');
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

}
