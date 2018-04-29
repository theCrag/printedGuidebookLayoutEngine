import * as express from 'express';
import * as _ from 'lodash';
import { ContentType, Get, Header, JsonController, Req, Res } from 'routing-controllers';

import { CragJsonApiService } from '../services/CragJsonApiService';
import { LayoutService } from '../services/layout/LayoutService';
import { PdfService } from '../services/PdfService';

@JsonController('/booklet')
export class BookletController {

    constructor(
        private cragJsonApiService: CragJsonApiService,
        private layoutService: LayoutService,
        private pdfService: PdfService
    ) { }

    @Get('/html/*')
    @ContentType('text/html')
    public async getHtml(@Req() req: express.Request): Promise<any> {
        const nodePath = req.path.replace('/api/booklet/html/', '');
        const area = await this.cragJsonApiService.loadNode(nodePath);
        return await this.layoutService.generate(area);
    }

    @Get('/pdf/*')
    @ContentType('application/octet-stream')
    @Header('Content-Transfer-Encoding', 'binary')
    public async getPdf(@Req() req: express.Request, @Res() res: express.Response): Promise<any> {
        const nodePath = req.path.replace('/api/booklet/pdf/', '');
        const area = await this.cragJsonApiService.loadNode(nodePath);
        const html = await this.layoutService.generate(area);
        const pdfData = await this.pdfService.createPDF(html);
        res.setHeader('Content-Disposition', `attachment; filename=${_.kebabCase(area.name)}.pdf`);
        return pdfData;
    }

}
