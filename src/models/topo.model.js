import path from '../assets/pineapple.jpg';

export class Topo {

  constructor(jsonTopo) {
    this.id = jsonTopo.id;
    this.hashID = jsonTopo.hashID;
    this.linked = jsonTopo.linked;
    this.width = jsonTopo.width;
    this.height = jsonTopo.height;
    this.type = 'Topo';

    this.layout = 1;
    // this.url = (this.hashID) ? `https://static.thecrag.com/original-image/${this.hashID.substring(0, 2)}/${this.hashID.substring(2, 4)}/${this.hashID}` : undefined;
    this.url = path;

    this.routesId = (jsonTopo.objects) ? jsonTopo.objects.filter(r => r.objectType === 'Route').map(r => r.objectID) : [];
  }

}
