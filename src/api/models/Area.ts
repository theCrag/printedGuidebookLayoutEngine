import { Exclude, Expose, Type } from 'class-transformer';

import { AreaChild } from './AreaChild';
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

    @Expose()
    public subAreaCount: number;

    @Expose({ name: 'beta' })
    @Type(() => Description)
    public description: Description[];

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
    @Type(() => Topo)
    public topos?: Topo[];

}
