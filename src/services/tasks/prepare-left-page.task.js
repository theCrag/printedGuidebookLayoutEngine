import { Task } from './task';

export class PrepareLeftPageTask extends Task {

  constructor(booklet, area) {
    super(booklet, area);
  }

  run(done) {
    this.booklet.addPage();
    if (this.booklet.isRightPage()) {
      this.booklet.addPage();
    }
    done();
  }

}
