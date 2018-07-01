export class Task {

  constructor(booklet, area, html) {
    this.booklet = booklet;
    this.area = area;
    this.html = html;
  }

  run(done) {
    done();
  }

}
