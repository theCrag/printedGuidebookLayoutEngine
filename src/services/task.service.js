export class TaskRunner {

  constructor(area, taskCreator, done) {
    this.area = area;
    this.taskCreator = taskCreator;
    this.done = done;

    this.tasks = this.taskCreator();
  }

  restart() {
    this.tasks = this.taskCreator();
    this.start();
  }

  start() {
    if (process.env.APP_TEST === 'true') {
      window.scrollTo(0, document.body.scrollHeight);
    }

    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      setTimeout(() => {
        return task(() => this.start(this.area, this.tasks, this.done));
      }, (process.env.APP_TEST === 'true') ? 10 : 0);
    } else {
      this.area.rendered = true;
      this.done();
    }
  }
}
