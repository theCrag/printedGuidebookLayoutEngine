import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AreaDescription {

    @Expose()
    public name: string;

    @Expose()
    public markdown: number;

}
