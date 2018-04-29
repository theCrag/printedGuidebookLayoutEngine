import { Service } from 'typedi';

import { Area } from '../../models/Area';
import { AreaBuilderService } from './AreaBuilderService';
import { HtmlService } from './HtmlService';

@Service()
export class LayoutService {

    constructor(
        private areaBuilderService: AreaBuilderService,
        private htmlService: HtmlService
    ) {
        //
    }

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
        /*
            1. Generate cover page
            2. Generate disclaimer
            3. Generate table of content
            4. Generate html for the areas
                a. Area main page (title, descriptions, map & possible image)
                b. Topos with routes
        */

        const coverContent = await this.buildCoverPage(area);
        const disclaimerContent = await this.buildDisclaimerPage(area);
        const areaContent = await this.buildAreaContent(area);
        const tableOfContent = await this.buildTableOfContent(area);

        return this.htmlService.buildHtmlSkeleton(area, [
            coverContent,
            disclaimerContent,
            tableOfContent,
            areaContent,
        ].join(''));
    }

    private async buildCoverPage(area: Area): Promise<string> {
        return '';
    }

    private async buildDisclaimerPage(area: Area): Promise<string> {
        return '';
    }

    private async buildTableOfContent(area: Area): Promise<string> {
        return '';
    }

    private async buildAreaContent(area: Area): Promise<string> {
        return this.areaBuilderService.build(area);
    }

}
