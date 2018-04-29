import { Service } from 'typedi';

import { Area } from '../../models/Area';

@Service()
export class LayoutService {

    // // const html = await this.htmlService.generateHtmlFromArea(area);
    // let html = await this.htmlService.getFirstPageOfArea(area);

    // // const height = await this.phantomService.getHeight(html, '.empty');
    // // console.log('height', height);

    // const { height, pageAmount } = await this.phantomService.getFreeSpaceInHeight(html);
    // console.log('height', height);
    // console.log('pageAmount', pageAmount);

    // html = html.replace(
    //     '<div class="empty">empty</div>',
    //     `<div style="background: cyan; width: 100%; height: ${height}px">Fill-Element</div>`
    // );
    public async generate(area: Area): Promise<string> {
        return 'Hello World!';
    }

}
