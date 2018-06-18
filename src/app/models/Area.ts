import { Exclude, Expose, Type, Transform } from 'class-transformer';

import { Description } from './Description';
import { Geometry } from './Geometry';
import { Topo } from './Topo';
import { Route } from '@/app/models/Route';

@Exclude()
export class Area {

  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public type: string;

  @Expose({ name: 'beta' })
  @Type(() => Description)
  public descriptions: Description[];

  @Expose()
  public subAreaCount?: number;

  @Expose({ name: 'children' })
  @Type(() => Area)
  @Transform((values) => {
    if (values) {
      return values.filter((v: any) => v.type === 'area');
    }
    return [];
  }, { toClassOnly: true })
  public subAreas: Area[];

  @Expose()
  @Type(() => Route)
  @Transform((_, area) => {
    if (area.children) {
      return area.children.filter((v: any) => v.type === 'route');
    }
    return [];
  }, { toClassOnly: true })
  public routes: Route[];

  @Expose()
  @Type(() => Topo)
  public topos?: Topo[];

  @Expose()
  @Type(() => Geometry)
  public geometry?: Geometry;

}
