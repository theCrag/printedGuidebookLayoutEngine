import { createLogger } from '../utils/logger';
import { TaskRunner } from '../services/task-runner';
import { Booklet } from '../services/booklet';
import { PORTRAIT } from '../models/orientation';
import { FULL_PAGE, FULL_WIDTH } from '../models/image-styles';
import { AreaTitleTask } from './tasks/area-title.task';
import { AreaGeometryTask } from './tasks/area-geometry.task';
import { AreaDescriptionTask } from './tasks/area-description.task';
import { AreaTopoTask } from './tasks/area-topo.task';
import { PrepareLeftPageTask } from './tasks/prepare-left-page.task';
import { RoutesContainerTask } from './tasks/routes-container.task';
import { RoutesMainTopoTask } from './tasks/routes-main-topo.task';
import { RoutesFullPageTopoTask } from './tasks/routes-full-page-topo.task';
import { RoutesItemTask } from './tasks/routes-item.task';
import { AreaValidationTask } from './tasks/area-validation.task';

export class Renderer {

  constructor() {
    this.booklet = new Booklet();

    this.log = createLogger('Renderer');
  }

  renderTree(tree, done) {
    this.log.info('start', tree);

    this.booklet.init();
    this.booklet.addPage();

    this._doRenderArea(tree, () => {
      this.booklet.addWhitespaceContainers();
      this.booklet.fillWhitespaceContainers(this.booklet.getWhitespaceContainers(), () => {
        done(tree);
      });
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

  _renderArea(area, done) {
    this.log.info('renderArea', area.name);

    const taskRunner = new TaskRunner(area, done, () => {
      const tasks = [];

      this.booklet.initArea();

      tasks.push(new AreaTitleTask(this.booklet, area));
      tasks.push(new AreaGeometryTask(this.booklet, area));

      area.descriptions.forEach((_, index) => {
        tasks.push(new AreaDescriptionTask(this.booklet, area, index));
      });

      // There are no routes
      if (area.routes.length === 0) {
        area.topos.forEach((_, index) => {
          tasks.push(new AreaTopoTask(this.booklet, area, index));
        });

      }
      // Render the routes of this area
      else {
        area.routeItems.forEach((item, index) => {

          if (item.type === 'Topo' && item.startOnLeftPage) {
            tasks.push(new PrepareLeftPageTask(this.booklet, area));
          }

          // If the first element is a full-page topo image
          if (index === 0 && item.type === 'Topo' && item.imageStyle === FULL_PAGE) {
            tasks.push(new RoutesFullPageTopoTask(this.booklet, area, index));
            tasks.push(new RoutesContainerTask(this.booklet, area));
            return;
          }

          // Init routes container possible page-width topo
          if (index === 0) {
            if (area.routesNeedToStartOnALeftPage) {
              tasks.push(new PrepareLeftPageTask(this.booklet, area));

            }
            tasks.push(new RoutesContainerTask(this.booklet, area));

            if (item.type === 'Topo' && item.imageStyle === FULL_WIDTH && item.orientation !== PORTRAIT) {
              tasks.push(new RoutesMainTopoTask(this.booklet, area, index));
              return;

            }

          }
          else {
            if (item.type === 'Topo' && item.imageStyle === FULL_WIDTH && item.orientation !== PORTRAIT) {
              tasks.push(new RoutesContainerTask(this.booklet, area));
              tasks.push(new RoutesMainTopoTask(this.booklet, area, index));
              return;

            }

            if (item.type === 'Topo' && item.imageStyle === FULL_PAGE) {
              tasks.push(new RoutesFullPageTopoTask(this.booklet, area, index));
              tasks.push(new RoutesContainerTask(this.booklet, area));
              return;

            }

          }

          // Render a column-width item
          tasks.push(new RoutesItemTask(this.booklet, area, index));

        });
      }

      tasks.push(new AreaValidationTask(this.booklet, area, () => {
        this.booklet.removeAllAreaRelatedElements(area);
        taskRunner.restart();
      }));

      return tasks;

    });


    this.log.info('start solving area tasks');
    taskRunner.start();
  }

}
