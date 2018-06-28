import path from '../assets/mountain.jpg';
import { COL_WIDTH } from './image-styles';
import { LANDSCAPE, PORTRAIT } from './orientation';
import { getImageUrl } from '../services/api.service';

export class Topo {

  constructor(jsonTopo, imageStyle) {
    this.id = jsonTopo.id;
    this.hashID = jsonTopo.hashID;
    this.linked = jsonTopo.linked;
    this.width = jsonTopo.width;
    this.height = jsonTopo.height;
    this.type = 'Topo';

    this.url = getImageUrl(this);
    // this.url = path;

    this.routesId = (jsonTopo.objects) ? jsonTopo.objects.filter(r => r.objectType === 'Route').map(r => r.objectID) : [];

    this.routesResponsible = [];
    this.startOnLeftPage = false;

    this.imageStyle = imageStyle || COL_WIDTH;
    this.orientation = (parseInt(this.width, 10) > parseInt(this.height, 10)) ? LANDSCAPE : PORTRAIT;

  }

}
