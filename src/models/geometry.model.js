/**
 * The geometry object is used to generate a google maps
 * component.
 */
export class Geometry {

  /**
   * @param {JsonObject} jsonGeometry
   */
  constructor(jsonGeometry) {
    /**
     * TODO: Map the needed properties of the geometry to generate
     * the google maps component. These following properties are
     * just some examples.
     */
    this.point = jsonGeometry.point;
    this.bbox = jsonGeometry.bbox;
    this.boundary = jsonGeometry.boundary;
    this.lat = jsonGeometry.lat;
    this.long = jsonGeometry.long;
    this.areasize = jsonGeometry.areasize;
  }

}
