import { Description } from './description.model';

export class Route {

  constructor(jsonRoute, index, parent) {
    this.id = jsonRoute.id;
    this.name = jsonRoute.name;
    this.type = 'Route';
    this.index = index;
    this.parent = parent;

    this.grade = jsonRoute.gradeInContext;
    this.style = jsonRoute.style;
    this.stars = jsonRoute.stars;
    this.bolts = jsonRoute.bolts;
    this.displayHeight = (jsonRoute.displayHeight) ? jsonRoute.displayHeight.join('') : '';

    this.descriptions = (jsonRoute.beta) ? jsonRoute.beta.map(d => new Description(d)) : [];
  }

}
