import * as pdf from 'html-pdf';
import { Service } from 'typedi';

import { env } from '../../env';

@Service()
export class PdfService {

    public createPDF(html: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            pdf.create(html, {
                height: '' + env.page.height,
                width: '' + env.page.width,
                format: env.page.format as any,
                // border: '30px',
                // footer: {
                //     height: '15px',
                //     contents: {
                //       default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                //     },
                //   },
            }).toBuffer((err, buffer) =>  resolve(buffer));
        });
    }

}
