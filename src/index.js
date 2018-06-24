import '../node_modules/paper-css/paper.css';
import './styles/style.scss';

import { createLogger } from './utils/logger';
import * as areaService from './services/area.service';
import * as rendererService from './services/renderer.service';

const log = createLogger('main');
log.info("start");

const rootAreaTree = areaService.fetchArea();
log.info("rootAreaTree", rootAreaTree);

rendererService.renderLayoutTree(rootAreaTree);
