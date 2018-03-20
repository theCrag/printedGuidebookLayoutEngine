import { Exclude, Expose, Type } from 'class-transformer';

import { Description } from './Description';

@Exclude()
export class Route {

    @Expose()
    public id: string;

    @Expose()
    public name: string;

    @Expose()
    public type?: string;

    @Expose({ name: 'beta' })
    @Type(() => Description)
    public descriptions?: Description[];

}
