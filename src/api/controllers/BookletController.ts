import * as express from 'express';
import * as pdf from 'html-pdf';
import { ContentType, Get, Header, JsonController, Req, Res } from 'routing-controllers';

import { CragJsonApiService } from '../services/CragJsonApiService';
import { HtmlService } from '../services/HtmlService';
import { PhantomService } from '../services/PhantomService';

@JsonController('/booklet')
export class BookletController {

    constructor(
        private cragJsonApiService: CragJsonApiService,
        private htmlService: HtmlService,
        private phantomService: PhantomService
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
    @Header('Content-Disposition', 'attachment; filename=panda.pdf')
    public async getPdf(@Req() req: express.Request, @Res() res: express.Response): Promise<any> {
        const nodePath = req.path.replace('/api/booklet/pdf/', '');
        const area = await this.cragJsonApiService.loadNode(nodePath);
        // const html = await this.htmlService.generateHtmlFromArea(area);
        let html = await this.htmlService.getFirstPageOfArea(area);

        // const height = await this.phantomService.getHeight(html, '.empty');
        // console.log('height', height);

        const height = await this.phantomService.getFreeSpaceInHeight(html);
        console.log('height', height);

        html = html.replace(
            '<div class="empty">empty</div>',
            `<div style="background: red; width: 100%; height: ${height}px">gugus</div>`
        );

        const createPDF = () => {
            return new Promise((resolve, reject) => {
                pdf.create(html).toBuffer((err, buffer) => {
                    console.log('This is a buffer:', Buffer.isBuffer(buffer));
                    resolve(buffer);
                });
            });
        };

        const pdfData = await createPDF();
        // res.setHeader('Content-Disposition', 'attachment; filename=panda.pdf');
        // res.setHeader('Content-Transfer-Encoding', 'binary');
        // res.setHeader('Content-Type', 'application/octet-stream');
        res.send(pdfData);
    }

}
