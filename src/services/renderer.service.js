import $ from "jquery";
import { cloneDeep } from 'lodash';

import { createLogger } from '../utils/logger';
import * as pageService from '../services/page.service';
import * as areaView from '../views/area.view';
import { TaskRunner } from "./task.service";

const log = createLogger('renderer');
let treePath = '';

export const renderLayoutTree = (tree) => {
  log.info('start', tree);

  pageService.init();
  pageService.addPage();

  doRenderArea(tree, () => {
    log.info('end', tree);
  });

}

export const doRenderArea = (area, done) => {
  log.info('doRenderArea', area);
  if (area) {
    if (area.rendered) {
      return doRenderArea(area.next(), done);
    }
    return renderArea(area, () => {
      doRenderArea(area.next(), done);
    });
  }
  done();
};

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
      tasks.push(pageService.addRoutesContainer(area, true));
      area.routeItems.forEach((item, index) => {
        if (index === 0 && item.type === 'Topo') {
          tasks.push(pageService.addRouteMainTopo(area, areaView.routeItem(item, area.id, index)))
        } else {
          tasks.push(pageService.addRouteItem(area, areaView.routeItem(item, area.id, index), index))
        }
      })
    }

    tasks.push(pageService.validateArea(area, () => {
      pageService.removeAllAreaRelatedElements(area);
      taskRunner.restart();
    }));

    return tasks;

  }, done);

  // log.info('start solving area tasks');
  taskRunner.start();

}
