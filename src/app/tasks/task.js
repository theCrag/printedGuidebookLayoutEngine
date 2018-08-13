
/**
 * Task is the base class for all render tasks.
 * One task modifies the DOM until it is done.
 */
export class Task {

  /**
   * @param {Booklet} booklet
   * @param {Area} area
   * @param {String} html
   */
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
