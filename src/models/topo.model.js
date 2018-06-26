import path from '../assets/mountain.jpg';
import { COL_WIDTH } from './image-styles';
import { LANDSCAPE, PORTRAIT } from './orientation';

export class Topo {

  constructor(jsonTopo, imageStyle) {
    this.id = jsonTopo.id;
    this.hashID = jsonTopo.hashID;
    this.linked = jsonTopo.linked;
    this.width = jsonTopo.width;
    this.height = jsonTopo.height;
    this.type = 'Topo';

    // this.url = (this.hashID) ? `https://static.thecrag.com/original-image/${this.hashID.substring(0, 2)}/${this.hashID.substring(2, 4)}/${this.hashID}` : undefined;
    this.url = path;

    this.routesId = (jsonTopo.objects) ? jsonTopo.objects.filter(r => r.objectType === 'Route').map(r => r.objectID) : [];

    this.imageStyle = imageStyle || COL_WIDTH;
    this.orientation = (this.width > this.height) ? LANDSCAPE : PORTRAIT;

  }

}
