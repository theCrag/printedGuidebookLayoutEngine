import { first, findIndex, cloneDeep } from 'lodash';

import { Topo } from './topo.model';
import { Route } from './route.model';
import { Geometry } from './geometry.model';
import { Description } from './description.model';
import { FULL_WIDTH } from './image-styles';
import { getDescriptionHtml } from '../services/api.service';

export class Area {

  constructor(jsonArea, parent) {
    this.id = jsonArea.id;
    this.name = jsonArea.name;
    this.type = jsonArea.type;
    this.subAreaCount = jsonArea.subAreaCount;

    this.parent = parent;
    this.rendered = false;
    this.fetched = false;

    this.breakBeforeRoutes = false;
    this.routesNeedToStartOnALeftPage = false;

    this.descriptions = (jsonArea.beta) ? jsonArea.beta.map(d => new Description(d)) : [];

    this.geometry = (jsonArea.geometry) ? new Geometry(jsonArea.geometry) : undefined;

    this.topos = (jsonArea.topos) ? jsonArea.topos.map(t => new Topo(t)) : [];

    this.routes = (jsonArea.children) ? jsonArea.children.filter(c => c.type === 'route').map((route, index) => new Route(route, index + 1, this)) : [];

    this.routeItems = cloneDeep(this.routes);
    if (this.routeItems.length > 0) {
      this.topos
        .filter(topo => topo.linked === undefined)
        .forEach(topo => {
          const firstRouteId = topo.routesId[0];
          const indexOfRoute = findIndex(this.routeItems, routeItem => routeItem.id === firstRouteId);
          this.routeItems.splice(indexOfRoute, 0, topo);
        });

      this.routeItems = this.routeItems.map((item) => {
        if (item.type === 'Topo') {
          if (item.routesId.length >= process.env.APP_TOPO_LARGE_SCALE) {
            item.imageStyle = FULL_WIDTH;
          }
        }
        return item;
      });

      let routes = [];
      this.routeItems = this.routeItems.reverse().map((item) => {
        if (item.type === 'Route') {
          routes.push(item.index);
        } else {
          item.routesResponsible = routes;
          routes = [];
        }
        return item;
      }).reverse();
    }

    this.subAreas = (jsonArea.children) ? jsonArea.children.filter(c => c.type === 'area').map(a => new Area(a, this)) : [];

  }

  next() {
    if (this.subAreas && this.subAreas.length > 0) {
      const subAreasToRender = this.subAreas.filter(a => !a.rendered);
      if (subAreasToRender.length > 0) {
        return first(subAreasToRender);
      }
    }

    if (this.parent) {
      return this.parent.next();
    }
  }

  fetchDescription(done) {
    if (this.descriptions.length > 0) {
      getDescriptionHtml(this, (jsonArea) => {
        this.descriptions = (jsonArea.beta) ? jsonArea.beta.map(d => new Description({
          name: d.name,
          markdown: d.markupHTML
        })) : this.descriptions;
        this.fetched = true;
        done();
      });
    } else {
      this.fetched = true;
      done();
    }
  }

  fetchNext() {
    if (this.subAreas && this.subAreas.length > 0) {
      const subAreasToFetch = this.subAreas.filter(a => !a.fetched);
      if (subAreasToFetch.length > 0) {
        return first(subAreasToFetch);
      }
    }

    if (this.parent) {
      return this.parent.fetchNext();
    }
  }

}
