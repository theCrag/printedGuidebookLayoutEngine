import path from '../assets/mountain.jpg';
import { getImageUrl } from '../services/api.service';

export class Topo {

  constructor(jsonTopo) {
    this.id = jsonTopo.id;
    this.hashID = jsonTopo.hashID;
    this.linked = jsonTopo.linked;
    this.width = jsonTopo.width;
    this.height = jsonTopo.height;
    this.type = 'Topo';

    this.layout = 1;
    // this.url = getImageUrl(this);
    this.url = path;

    this.routesId = (jsonTopo.objects) ? jsonTopo.objects.filter(r => r.objectType === 'Route').map(r => r.objectID) : [];
  }

}
