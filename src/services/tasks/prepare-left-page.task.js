import { Task } from './task';
import { createLogger } from '../../utils/logger';

export class PrepareLeftPageTask extends Task {

  constructor(booklet, area) {
    super(booklet, area);

    this.log = createLogger('PrepareLeftPageTask');
  }

  run(done) {
    this.log.info('create left page');
    this.booklet.addPage();
    if (this.booklet.isRightPage()) {
      this.booklet.addPage();
    }
    done();
  }

}
