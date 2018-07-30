import { createLogger } from './utils/logger';
import * as areaService from './services/area.service';
import { Renderer } from './renderer';

export class Application {

  constructor() {
    this.renderer = new Renderer();
    this.log = createLogger('Application');
  }

  main() {
    areaService.fetchArea(((rootAreaTree) => {
      this.log.info('rootAreaTree', rootAreaTree);

      this.renderer.renderTree(rootAreaTree, () => {
        this.log.info('final rendered tree', rootAreaTree);
      });

    }));
  }

}
