import * as express from 'express';
import * as _ from 'lodash';
import { ContentType, Get, Header, JsonController, Req, Res } from 'routing-controllers';

import { CragJsonApiService } from '../services/CragJsonApiService';
import { HtmlService } from '../services/HtmlService';
import { PdfService } from '../services/PdfService';
import { PhantomService } from '../services/PhantomService';

@JsonController('/booklet')
export class BookletController {

    constructor(
        private cragJsonApiService: CragJsonApiService,
        private htmlService: HtmlService,
        private phantomService: PhantomService,
        private pdfService: PdfService
    ) { }

    @Get('/html/*')
    @ContentType('text/html')
    public async getHtml(@Req() req: express.Request): Promise<any> {
        const nodePath = req.path.replace('/api/booklet/html/', '');
        const area = await this.cragJsonApiService.loadNode(nodePath);
        // const html = await this.htmlService.generateHtmlFromArea(area);
        return await this.htmlService.getFirstPageOfArea(area);
    }

    @Get('/pdf/*')
    @ContentType('application/octet-stream')
    @Header('Content-Transfer-Encoding', 'binary')
    public async getPdf(@Req() req: express.Request, @Res() res: express.Response): Promise<any> {
        const nodePath = req.path.replace('/api/booklet/pdf/', '');
        const area = await this.cragJsonApiService.loadNode(nodePath);

        // TODO: START
        // const html = await this.htmlService.generateHtmlFromArea(area);
        let html = await this.htmlService.getFirstPageOfArea(area);

        // const height = await this.phantomService.getHeight(html, '.empty');
        // console.log('height', height);

        const { height, pageAmount } = await this.phantomService.getFreeSpaceInHeight(html);
        console.log('height', height);
        console.log('pageAmount', pageAmount);

        html = html.replace(
            '<div class="empty">empty</div>',
            `<div style="background: cyan; width: 100%; height: ${height}px">Fill-Element</div>`
        );

        // TODO: END

        const pdfData = await this.pdfService.createPDF(html);
        res.setHeader('Content-Disposition', `attachment; filename=${_.kebabCase(area.name)}.pdf`);
        return pdfData;
    }

}
