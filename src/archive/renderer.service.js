import { cloneDeep } from 'lodash';

import { createLogger } from '../utils/logger';
import * as pageService from '../services/page.service';
import * as areaView from '../views/area.view';
import { TaskRunner } from './task.service';
import { FULL_WIDTH, FULL_PAGE } from '../models/image-styles';
import { PORTRAIT } from '../models/orientation';

export class Renderer {

  constructor(booklet) {
    this.booklet = booklet;

    this.log = createLogger('Renderer');
  }

  renderTree(tree, done) {
    this.log.info('start', tree);

    this.booklet.init();
    this.booklet.addPage();

    this._doRenderArea(tree, () => {
      this.log.info('end', tree);
      done(tree);
    });
  }

  _doRenderArea(area, done) {
    this.log.info('doRenderArea', area);
    if (area) {
      if (area.rendered) {
        return this._doRenderArea(area.next(), done);
      }
      return this._renderArea(area, () => {
        this._doRenderArea(area.next(), done);
      });
    }
    done();
  }


}

// export const renderLayoutTree = (tree) => {
//   log.info('start', tree);

//   pageService.init();
//   pageService.addPage();

//   doRenderArea(tree, () => {
//     log.info('end', tree);
//   });

// };

// export const doRenderArea = (area, done) => {
//   log.info('doRenderArea', area);
//   if (area) {
//     if (area.rendered) {
//       return doRenderArea(area.next(), done);
//     }
//     return renderArea(area, () => {
//       doRenderArea(area.next(), done);
//     });
//   }
//   done();
// };

export const renderArea = (area, done) => {
  log.info('renderArea', area.name);

  const taskRunner = new TaskRunner(area, () => {
    pageService.initArea();

    const tasks = [
      pageService.addContent(area, areaView.title(cloneDeep(area))),
      pageService.addContent(area, areaView.geometry(cloneDeep(area))),
    ];

    area.descriptions.forEach((description, index) => {
      tasks.push(pageService.addContent(area, areaView.description(description, area.id, index)));
    });

    // There are no routes
    if (area.routes.length === 0) {
      area.topos.forEach((topo, index) => {
        tasks.push(pageService.addContent(area, areaView.topo(topo, area.id, index)));
      });
    }
    // Render the routes of this area
    else {
      area.routeItems.forEach((item, index) => {

        if (item.type === 'Topo' && item.startOnLeftPage) {
          tasks.push(pageService.prepareLeftPage());
        }

        // If the first element is a full-page topo image
        if (index === 0 && item.type === 'Topo' && item.imageStyle === FULL_PAGE) {
          tasks.push(pageService.addFullPageTopo(area, areaView.topo(item, area.id, index)));
          tasks.push(pageService.addRoutesContainer(area));
          return;
        }

        // Init routes container possible page-width topo
        if (index === 0) {
          if (area.routesNeedToStartOnALeftPage) {
            tasks.push(pageService.prepareLeftPage());
          }
          tasks.push(pageService.addRoutesContainer(area));

          if (item.type === 'Topo' && item.imageStyle === FULL_WIDTH && item.orientation !== PORTRAIT) {
            tasks.push(pageService.addRouteMainTopo(area, areaView.topo(item, area.id, index)));
            return;
          }
        } else {
          if (item.type === 'Topo' && item.imageStyle === FULL_WIDTH && item.orientation !== PORTRAIT) {
            tasks.push(pageService.addRoutesContainer(area));
            tasks.push(pageService.addRouteMainTopo(area, areaView.topo(item, area.id, index)));
            return;
          }

          if (item.type === 'Topo' && item.imageStyle === FULL_PAGE) {
            tasks.push(pageService.addFullPageTopo(area, areaView.topo(item, area.id, index)));
            tasks.push(pageService.addRoutesContainer(area));
            return;
          }
        }

        // Render a column-width item
        tasks.push(pageService.addRouteItem(area, areaView.routeItem(item, area.id, index), index));

      });
    }

    tasks.push(pageService.validateArea(area, () => {
      pageService.removeAllAreaRelatedElements(area);
      taskRunner.restart();
    }));


    return tasks;

  }, done);


  // log.info('start solving area tasks');
  taskRunner.start();

};