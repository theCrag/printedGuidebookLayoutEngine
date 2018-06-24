import { cloneDeep } from 'lodash';

import { createLogger } from '../utils/logger';
import * as pageService from '../services/page.service';
import * as areaView from '../views/area.view';

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

  const tasks = [
    pageService.addContent(areaView.title(cloneDeep(area))),
    pageService.addContent(areaView.geometry(cloneDeep(area))),
  ];

  area.descriptions.forEach(description => {
    tasks.push(pageService.addContent(areaView.description(description)));
  });

  // There are not routes
  if (area.routes.length === 0) {
    area.topos.forEach(topo => {
      tasks.push(pageService.addContent(areaView.topo(topo)));
    });
  }
  // Render the routes of the this area
  else {
    tasks.push(pageService.addRoutesContainer());
    area.routeItems.forEach((item, index) => {
      if (index === 0 && item.type === 'Topo') {
        tasks.push(pageService.addRouteMainTopo(areaView.routeItem(item)))
      } else {
        tasks.push(pageService.addRouteItem(areaView.routeItem(item)))
      }
    })
  }

  // log.info('start solving area tasks');
  runNextTask(area, tasks, done);

}

export const runNextTask = (area, tasks, done) => {
  if (tasks.length > 0) {
    // log.info('run task', tasks.length);
    const task = tasks.shift();
    return task(() => runNextTask(area, tasks, done));
  }
  area.rendered = true;
  done();
};
