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

  // const subArea = tree.next();
  // subArea.rendered = true;
  // log.info('first subArea', subArea);

  // const subSubArea = subArea.next();
  // log.info('first subSubArea', subSubArea);

  // const second = subArea.parent.next();
  // log.info('second subArea', second);

  renderArea(tree, () => {
    log.info('end', tree);
  });

}

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
    done();
  };
  run();

}
