import * as express from 'express';
import * as _ from 'lodash';
import { ContentType, Get, Header, JsonController, Req, Res } from 'routing-controllers';

import { CragJsonApiService } from '../services/CragJsonApiService';
import { LaTexService } from '../services/LaTexService';
import { LayoutService } from '../services/layout/LayoutService';

@JsonController('/booklet')
export class BookletController {

    constructor(
        private cragJsonApiService: CragJsonApiService,
        private layoutService: LayoutService,
        private laTexService: LaTexService
    ) { }

    @Get('/html/*')
    @ContentType('text/html')
    public async getHtml(@Req() req: express.Request): Promise<any> {
        const nodePath = req.path.replace('/api/booklet/html/', '');
        const area = await this.cragJsonApiService.loadNode(nodePath);
        const html = await this.layoutService.generate(area);
        return html;
    }

    @Get('/pdf/*')
    @ContentType('application/octet-stream')
    @Header('Content-Transfer-Encoding', 'binary')
    public async getPdf(@Req() req: express.Request, @Res() res: express.Response): Promise<any> {
        const nodePath = req.path.replace('/api/booklet/pdf/', '');
        const area = await this.cragJsonApiService.loadNode(nodePath);

        const pdfData = await this.laTexService.createPDF(`
\\documentclass[a4paper]{article}

\\begin{document}

\\begin{titlepage}
    \\begin{center}
    \\line(1,0){300} \\\\ [0.25in]
    \\huge{
        \\bfseries ${area.name}
    } \\\\ [2mm]
    \\line(1,0){200} \\\\ [1.5cm]
    \\textsc{
        \\LARGE A Test Script
    } \\\\ [0.75cm]
        \\textsc{
        \\LARGE On using Latex to Write a Simple Report
    } \\\\ [8cm]
    \\end{center}
    \\begin{flushright}
        \\textsc{
            \\large Gery H.
        } \\\\
        A Latex User \\
        \\# 27347877 \\\\
        June 26, 2018 \\\\
    \\end{flushright}
\\end{titlepage}
\\end{document}
        `);
        res.setHeader('Content-Disposition', `attachment; filename=${_.kebabCase(area.name)}.pdf`);
        return pdfData;
    }

}
