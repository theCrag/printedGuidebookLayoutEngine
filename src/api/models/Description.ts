import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Description {

    @Expose()
    public name: string;

    @Expose()
    public markdown: number;

    public get html(): string {
        return `<div class="area-description">
            <p><b>${this.name}</b><br>${this.markdown}</p>
        </div>`;
    }

}
