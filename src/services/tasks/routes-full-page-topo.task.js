import { Task } from './task';

export class RoutesFullPageTopoTask extends Task {

  constructor(booklet, area, index) {
    super(booklet, area);

    this.index = index;
  }

  run(done) {
    // TODO:
    done();
  }

}
