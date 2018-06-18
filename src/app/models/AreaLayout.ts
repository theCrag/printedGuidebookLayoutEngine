import { Area } from '@/app/models/Area';
import { Topo } from '@/app/models/Topo';

export class AreaLayout {

  public static build(area: Area, images: any): AreaLayout {
    const areaLayout = new AreaLayout();
    areaLayout.area = area;
    areaLayout.images = images;
    return areaLayout;
  }

  public area: Area;
  public images: Array<{ image: Topo, variant: number }>;
  public subAreas: AreaLayout[][];

}
