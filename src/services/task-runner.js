/**
 * The TaskRunner provides a simple task execution.
 * It only runs the next task if the previous one is finished.
 */
export class TaskRunner {

  /**
   * @param {Area} area
   * @param {Function} done Callback function
   * @param {Function} taskCreator Function to create the task list
   */
  constructor(area, done, taskCreator) {
    this.area = area;
    this.taskCreator = taskCreator;
    this.done = done;

    this.tasks = this.taskCreator();
  }

  /**
   * Recreates the task list and restarts the
   * task solving process.
   */
  restart() {
    this.tasks = this.taskCreator();
    this.start();
  }

  /**
   * Starts the task running. It takes the first tasks of the tasks
   * array and runs it. After the task is done it calls the next one.
   */
  start() {
    // During test mode we want to scroll along the created pages.
    if (process.env.APP_TEST === 'true') {
      window.scrollTo(0, document.body.scrollHeight);
    }

    // Run task of the given area as long as there are tasks.
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      setTimeout(() => {
        return task.run(() => this.start(this.area, this.tasks, this.done));
      }, 0);

    } else {
      // If all tasks are done the task-runner is finished as well.
      // Moreover, the area got marked as rendered, so we can easily detect
      // which area of the rootArea tree are rendered and which are not.
      this.area.rendered = true;
      this.done();
    }
  }
}
