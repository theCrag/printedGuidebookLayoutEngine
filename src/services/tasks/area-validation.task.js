import $ from 'jquery';
import { first } from 'lodash';

import { createLogger } from '../../utils/logger';
import { Task } from './task';

/**
 * Here the rendered area will validated and optimized.
 */
export class AreaValidationTask extends Task {

  constructor(booklet, area, reset) {
    super(booklet, area);

    this.reset = reset;
    this.log = createLogger('AreaValidationTask');
  }

  /**
   * Verifies if all the mentioned routes in a topo are
   * in sight of it. This means that the routes do not need
   * the minimum of scrolling pages.
   *
   * @param {Function} done
   */
  run(done) {
    const routes = $(`.routes.area-${this.area.id}`);

    if (routes.length > 1) {
      this.log.info('validateArea', this.area, routes);

      // Check if topo got missing on a right page
      const isFirstRoutesPageRight = routes.first().closest('.sheet').hasClass('sheet--right');
      if (isFirstRoutesPageRight && !this.area.routesNeedToStartOnALeftPage) {
        if (this.countRouteItems(routes.first()) === 1) {
          this.area.routesNeedToStartOnALeftPage = true;
          this.log.warn('first element go missing on a right page!');
          return this.reset();
        }
      }

      // TODO: Gery has to fix this
      // TODO: wenn Topo + Routes auf einer Seite Platz haben, muss es nicht zwingend eine linke Seite sein
      // Validate if the last route of a topo is in sight, otherwise start with the topo on
      // left top page.
      let restartRendering = false;
      this.area.routeItems = this.area.routeItems.map(item => {
        if (item.type === 'Topo' && !restartRendering && !item.startOnLeftPag) {

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

            const pages = $(pageElements.map(e => `#${e.attr('id')}`).join(', '));
            const lastRouteInSight = pages.find(`#route-${this.area.id}-${first(item.routesResponsible)}`);

            if (lastRouteInSight.length === 0 && !item.startOnLeftPage && !restartRendering) {
              item.startOnLeftPage = true;
              restartRendering = true;
              this.log.warn('last route is not in sight', topoElement, item);

            }
          }

        }
        return item;
      });

      if (restartRendering) {
        return this.reset();
      }

      done();
    } else {
      done();
    }
  }

  countRouteItems(routesContainer) {
    const amountTopo = $(routesContainer).find('.topo').not('.route--blank').length;
    const amountRoutes = $(routesContainer).find('.route').not('.route--blank').length;
    return amountTopo + amountRoutes;
  }

}
