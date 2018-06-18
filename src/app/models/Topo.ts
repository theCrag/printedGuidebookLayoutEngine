
import { Exclude, Expose, Type } from 'class-transformer';

import { Route } from './Route';

@Exclude()
export class Topo {

  @Expose()
  public id: string;

  @Expose()
  public hashID: string;

  @Expose()
  public linked: string;

  @Expose()
  public width: string;

  @Expose()
  public height: string;

  @Expose({ name: 'objects' })
  @Type(() => Route)
  public routes: Route[];

}
