/**
 * The TaskRunner that provides the a simple task execution.
 * It only runs the next task if the previous has finished.
 */
export class TaskRunner {

  /**
   * Creates an instance of TaskRunner.
   *
   * @param {Area} area
   * @param {Function} taskCreator Function to create the task list
   * @param {Function} done Callback function
   */
  constructor(area, done, taskCreator) {
    this.area = area;
    this.taskCreator = taskCreator;
    this.done = done;

    this.tasks = this.taskCreator();
  }

  /**
   * Recreates the task list and restarts the
   * task solving process
   */
  restart() {
    this.tasks = this.taskCreator();
    this.start();
  }

  /**
   * Starts the task running. It takes the first tasks of the
   * tasks array and runs it. After the task is done it calls the next.
   */
  start() {
    // During test mode we want to scroll along the create pages.
    if (process.env.APP_TEST === 'true') {
      window.scrollTo(0, document.body.scrollHeight);
    }

    // Run task of the given area as long there are tasks.
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      setTimeout(() => {
        return task.run(() => this.start(this.area, this.tasks, this.done));
      }, (process.env.APP_TEST === 'true') ? 20 : 0);

    } else {
      // If all tasks are done the task-runner is done as well.
      // Moreover, the area got marked as rendered, so we can easily
      // detect which area of the rootArea tree are rendered and which not.
      this.area.rendered = true;
      this.done();
    }
  }
}
