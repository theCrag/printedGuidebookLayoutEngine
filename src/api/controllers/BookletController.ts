import * as express from 'express';
import { ContentType, Get, JsonController, Req } from 'routing-controllers';

import { CragJsonApiService } from '../services/CragJsonApiService';
import { HtmlService } from '../services/HtmlService';

@JsonController('/booklet')
export class BookletController {

    constructor(
        private cragJsonApiService: CragJsonApiService,
        private htmlService: HtmlService
    ) { }

    @Get('/*')
    @ContentType('text/html')
    public async node(@Req() req: express.Request): Promise<any> {
        const nodePath = req.path.replace('/api/booklet/', '');
        const area =  await this.cragJsonApiService.loadNode(nodePath);
        const html = await this.htmlService.generateHtmlFromArea(area);
        return html;
    }

}
