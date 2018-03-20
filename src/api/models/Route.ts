import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { Description } from './Description';

@Exclude()
export class Route {

    @Expose()
    public id: string;

    @Expose()
    public name: string;

    @Expose({ name: 'beta' })
    @Type(() => Description)
    public description?: Description[];

    @Expose()
    @Transform(value => value ? Object.keys(value).map(k => k.substring(2)) : undefined, { toClassOnly: true })
    public flags?: string[];

    @Expose()
    @Transform(values => values && values.length > 0 ? values.join('') : undefined, { toClassOnly: true })
    public height?: string;

    @Expose()
    public grade: string;

    @Expose()
    public style: string;

    @Expose()
    public bolts: string;

    @Expose()
    public points?: string;

    @Expose()
    public stars: string;

}
