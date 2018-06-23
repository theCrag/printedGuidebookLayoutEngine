import { at } from 'lodash';

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
    pageService.addContent(areaView.title(area)),
    pageService.addContent(areaView.geometry(area)),
  ];

  area.descriptions.forEach(description => {
    tasks.push(pageService.addContent(areaView.description(description)));
  });

  area.topos.forEach(topo => {
    tasks.push(pageService.addContent(areaView.topo(topo)));
  });

  log.info('tasks', tasks);
  const run = () => {
    log.info('-->', tasks.length);
    if (tasks.length > 0) {
      const task = tasks.shift();
      return task(() => run());
    }
    area.rendered = true;
    done();
  };
  run();

}
