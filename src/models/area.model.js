import { first } from 'lodash';

import { Topo } from './topo.model';
import { Route } from './route.model';
import { Geometry } from './geometry.model';
import { Description } from './description.model';

export class Area {

  constructor(jsonArea, parent) {
    this.id = jsonArea.id;
    this.name = jsonArea.name;
    this.type = jsonArea.type;
    this.subAreaCount = jsonArea.subAreaCount;

    this.parent = parent;
    this.rendered = false;

    this.descriptions = (jsonArea.beta) ? jsonArea.beta.map(d => new Description(d)) : undefined;

    this.geometry = (jsonArea.geometry) ? new Geometry(jsonArea.geometry) : undefined;

    this.topos = (jsonArea.topos) ? jsonArea.topos.map(t => new Topo(t)) : [];

    this.subAreas = (jsonArea.children) ? jsonArea.children.filter(c => c.type === 'area').map(a => new Area(a, this)) : [];

    this.routes = (jsonArea.children) ? jsonArea.children.filter(c => c.type === 'route').map(r => new Route(r, this)) : [];
  }

  first() {
    if (this.subAreas && this.subAreas.length > 0) {
      return first(this.subAreas);
    }
    return;
  }

  next() {
    if (this.subAreas && this.subAreas.length > 0) {
      return first(this.subAreas.filter(a => !a.rendered));
    }
  }

}
