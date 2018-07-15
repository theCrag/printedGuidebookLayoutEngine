/**
 * Task is the base class for all render tasks.
 * One Task modifies the DOM until it is done.
 */
export class Task {

  constructor(booklet, area, html) {
    this.booklet = booklet;
    this.area = area;
    this.html = html;
  }

  /**
   * Modifies the DOM and calls done when it has finished.
   *
   * @param {Function} done
   */
  run(done) {
    done();
  }

}
