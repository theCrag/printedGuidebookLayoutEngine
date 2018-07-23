import { Description } from './description.model';

/**
 * Route of an area.
 */
export class Route {

  /**
   * @param {JsonObject} jsonRoute
   * @param {Number} index
   * @param {Area} parent
   */
  constructor(jsonRoute, index, parent) {
    /**
     * Id of the route
     */
    this.id = jsonRoute.id;
    /**
     * Name or title of the route
     */
    this.name = jsonRoute.name;
    /**
     * Type which is used for the areas routeItems.
     */
    this.type = 'Route';
    /**
     * Order of the route.
     */
    this.index = index;
    /**
     * Area in within is the route.
     */
    this.parent = parent;
    /**
     * Descriptions of the route.
     */
    this.descriptions = (jsonRoute.beta) ? jsonRoute.beta.map(d => new Description(d)) : [];
    /**
     * Some route additional information.
     */
    this.grade = jsonRoute.gradeInContext;
    this.style = jsonRoute.style;
    this.stars = jsonRoute.stars;
    this.bolts = jsonRoute.bolts;
    this.displayHeight = (jsonRoute.displayHeight) ? jsonRoute.displayHeight.join('') : '';

  }

}
