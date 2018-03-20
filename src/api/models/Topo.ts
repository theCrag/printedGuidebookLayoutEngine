import { Exclude, Expose, Type } from 'class-transformer';

import { Route } from './Route';

@Exclude()
export class Topo {

    @Expose()
    public id: string;

    @Expose()
    public hashID: string;

    @Expose({ name: 'objects' })
    @Type(() => Route)
    public routes: Route[];

}
