import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AreaChild {

    @Expose()
    public id: string;

    @Expose()
    public name: string;

    @Expose()
    public type: string;

    @Expose()
    public subAreaCount: number;

    @Expose({ toClassOnly: true })
    public urlStub: string;

    @Expose({ toClassOnly: true })
    public urlAncestorStub: string;

    @Expose({ toPlainOnly: true })
    public get url(): string {
        return this.urlStub
            ? this.urlStub
            : `${this.urlAncestorStub}/area/${this.id}`;
    }

}
