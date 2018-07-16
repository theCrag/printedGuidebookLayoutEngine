import path from '../assets/mountain.jpg';
import { COL_WIDTH } from './image-styles';
import { LANDSCAPE, PORTRAIT } from './orientation';
// import { buildImageUrl } from '../services/api.service';

/**
 * The topo is a image of an area which shows their subareas or routes.
 */
export class Topo {

  /**
   * @param {JsonObject} jsonTopo
   * @param {ImageStyle} imageStyle
   */
  constructor(jsonTopo, imageStyle) {
    /**
     * Id of the topo
     */
    this.id = jsonTopo.id;
    /**
     * HashId of the topo. This can be used to fetch the
     * image form the crag-api.
     */
    this.hashID = jsonTopo.hashID;
    /**
     * This flag tells if the image originals belongs to another area.
     */
    this.linked = jsonTopo.linked;
    /**
     * Width of the image
     */
    this.width = jsonTopo.width;
    /**
     * Height of the image
     */
    this.height = jsonTopo.height;
    /**
     * Type is used for the routeItems.
     */
    this.type = 'Topo';
    /**
     * URL ot the image on the crag-server.
     */
    // this.url = buildImageUrl(this);
    this.url = path;
    /**
     * This is needed to place the topo in the routeItems of the area
     * in the correct position.
     */
    this.routesId = (jsonTopo.objects) ? jsonTopo.objects.filter(r => r.objectType === 'Route').map(r => r.objectID) : [];
    /**
     * All the route ids within in the topo image.
     */
    this.routesResponsible = [];
    /**
     * During the render process this flag is read, to set the topo image
     * on a left page.
     */
    this.startOnLeftPage = false;
    /**
     * Image style of the image. Tells the size of it.
     */
    this.imageStyle = imageStyle || COL_WIDTH;
    /**
     * Orientation of the image.
     */
    this.orientation = (parseInt(this.width, 10) > parseInt(this.height, 10)) ? LANDSCAPE : PORTRAIT;

  }

}
