export class Geometry {

  constructor(jsonGeometry) {
    this.point = jsonGeometry.point;
    this.bbox = jsonGeometry.bbox;
    this.boundary = jsonGeometry.boundary;
    this.lat = jsonGeometry.lat;
    this.long = jsonGeometry.long;
    this.areasize = jsonGeometry.areasize;
  }

}
