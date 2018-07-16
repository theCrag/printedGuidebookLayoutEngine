import { first, findIndex, cloneDeep } from 'lodash';

import { Topo } from './topo.model';
import { Route } from './route.model';
import { Geometry } from './geometry.model';
import { Description } from './description.model';
import { FULL_WIDTH } from './image-styles';
import { getDescriptionHtml } from '../services/api.service';

/**
 * There are 2 types of areas. One that has no routes, but subareas and area-topo images
 * and the other area has routes.
 */
export class Area {

  /**
   * @param {JsonObject} jsonArea
   * @param {Area} parent
   */
  constructor(jsonArea, parent) {
    /**
     * Id of the area
     */
    this.id = jsonArea.id;
    /**
     * Name or title of the area
     */
    this.name = jsonArea.name;
    /**
     * Parent area in the tree. If this is
     * undefined then it is the root area.
     */
    this.parent = parent;
    /**
     * This flag indicates if this area has been
     * added to the dom.
     */
    this.rendered = false;
    /**
     * This indicates if the description html has been fetched.
     */
    this.fetched = false;
    /**
     * During the render process this flag will be read. This could be
     * true if the routes of a topo are not in sight. So the routes
     * should start on a left page to optimise the rendering process.
     */
    this.routesNeedToStartOnALeftPage = false;
    /**
     * The descriptions of the area in the html format.
     */
    this.descriptions = (jsonArea.beta) ? jsonArea.beta.map(d => new Description(d)) : [];
    /**
     * The geometry object is needed to generate a google maps component.
     */
    this.geometry = (jsonArea.geometry) ? new Geometry(jsonArea.geometry) : undefined;
    /**
     * Topo are images of routes or subareas.
     */
    this.topos = (jsonArea.topos) ? jsonArea.topos.map(t => new Topo(t)) : [];
    /**
     * Routes object of an area.
     */
    this.routes = (jsonArea.children) ? jsonArea.children.filter(c => c.type === 'route').map((route, index) => new Route(route, index + 1, this)) : [];
    /**
     * Route items are a collection of the routes and the topos. This
     * is needed for the rendering process due to the correct order of
     * the elements.
     */
    this.routeItems = cloneDeep(this.routes);
    if (this.routeItems.length > 0) {
      // Place the topo image at correct place, so that is before
      // his upcoming routes.
      this.topos
        .filter(topo => topo.linked === undefined)
        .forEach(topo => {
          const firstRouteId = topo.routesId[0];
          const indexOfRoute = findIndex(this.routeItems, routeItem => routeItem.id === firstRouteId);
          this.routeItems.splice(indexOfRoute, 0, topo);
        });

      // Set the default image style for large topos.
      this.routeItems = this.routeItems.map((item) => {
        if (item.type === 'Topo') {
          if (item.routesId.length >= process.env.APP_TOPO_LARGE_SCALE) {
            item.imageStyle = FULL_WIDTH;
          }
        }
        return item;
      });

      // Set the routes to their corresponding topo image.
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

    /**
     * Subareas of this area.
     */
    this.subAreas = (jsonArea.children) ? jsonArea.children.filter(c => c.type === 'area').map(a => new Area(a, this)) : [];

  }

  /**
   * Next returns the next area of the tree to render.
   */
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

  /**
   * FetchNext returns the next area of the tree to fetch the html description.
   * An area has several description, which normally is in the markdown
   * format thats why we had to fetch the html format.
   */
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

  /**
   * Fetches the html description of the current area.
   *
   * @param {Function} done
   */
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

}
