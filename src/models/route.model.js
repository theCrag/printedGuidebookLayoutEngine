import { Description } from './description.model';

export class Route {

  constructor(jsonRoute, parent) {
    this.id = jsonRoute.id;
    this.name = jsonRoute.name;
    this.type = jsonRoute.type;
    this.parent = parent;

    this.descriptions = (jsonRoute.beta) ? jsonRoute.beta.map(d => new Description(d)) : undefined;
  }

}
