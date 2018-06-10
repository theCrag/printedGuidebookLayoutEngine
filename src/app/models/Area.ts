import { Exclude, Expose, Type } from 'class-transformer';

import { Description } from './Description';
import { Geometry } from './Geometry';
import { Topo } from './Topo';

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

  @Expose()
  @Type(() => Area)
  public children?: Area[];

  @Expose()
  @Type(() => Topo)
  public topos?: Topo[];

  @Expose()
  @Type(() => Geometry)
  public geometry?: Geometry;

}
