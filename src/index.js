import '../node_modules/paper-css/paper.css';
import './styles/style.scss';

import { createLogger } from './utils/logger';
import * as areaService from './services/area.service';
import { Renderer } from './services/renderer';

const log = createLogger('main');
log.info('start');


areaService.fetchArea(((rootAreaTree) => {
  log.info('rootAreaTree', rootAreaTree);
  // rendererService.renderLayoutTree(rootAreaTree);

  const renderer = new Renderer();
  renderer.renderTree(rootAreaTree, () => {
    log.info('final rendered tree', rootAreaTree);
  });

}));
