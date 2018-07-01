import { Task } from './task';

export class RoutesContainerTask extends Task {

  constructor(booklet, area) {
    super(booklet, area);
  }

  run(done) {
    this.booklet.addRoutesContainer(this.area, done);
  }

}
