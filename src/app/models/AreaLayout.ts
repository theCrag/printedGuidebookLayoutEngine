import { Area } from '@/app/models/Area';
import { Topo } from '@/app/models/Topo';

export class AreaLayout {

  public static build(areaId: string, images: any): AreaLayout {
    const areaLayout = new AreaLayout();
    areaLayout.areaId = areaId;
    areaLayout.images = images;
    return areaLayout;
  }

  public areaId: string;
  public images: Array<{ imageId: string, variant: number }>;
  public subAreas: AreaLayout[][];

}
