import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Description {

    @Expose()
    public name: string;

    @Expose()
    public markdown: number;

}
