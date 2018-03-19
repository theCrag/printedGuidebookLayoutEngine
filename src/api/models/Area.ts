import { Exclude, Expose, Type } from 'class-transformer';

import { AreaChild } from './AreaChild';
import { AreaDescription } from './AreaDescription';
import { Geometry } from './Geometry';
import { Route } from './Route';

@Exclude()
export class Area {

    @Expose()
    public id: string;

    @Expose()
    public name: string;

    @Expose()
    public type: string;

    @Expose()
    public subAreaCount: number;

    @Expose({ name: 'beta' })
    @Type(() => AreaDescription)
    public areaDescription: AreaDescription[];

    @Expose()
    @Type(() => Geometry)
    public geometry: Geometry;

    @Expose({ toClassOnly: true })
    @Type(() => AreaChild)
    public children: AreaChild[];

    @Expose()
    @Type(() => Area)
    public subAreas?: Area[];

    @Expose()
    @Type(() => Route)
    public routes?: Route[];

    // TODO: add topos

}
