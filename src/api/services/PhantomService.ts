import * as phantom from 'phantom';
import { Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class PhantomService {

    public static WIDTH = 595;
    public static HEIGHT = 842;
    public static MARGIN = 8;

    private instance: phantom.PhantomJS;
    private page: phantom.WebPage;

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) {
        this.init();
    }

    public async getHeight(html: string, selector: string): Promise<any> {
        this.log.info('getHeight of ', selector);
        this.page.setContent(html, '');
        /* tslint:disable */
        return await this.page.evaluate(function (s) {
            return (document.querySelector(s) as any).clientHeight;
        }, selector);
        /* tslint:enable */
    }

    public async getFreeSpaceInHeight(html: string): Promise<any> {
        this.page.setContent(html, '');
        /* tslint:disable */
        const height = await this.page.evaluate(function (s) {
            return (document.querySelector(s) as any).offsetTop;
        }, '.empty');
        /* tslint:enable */
        return PhantomService.HEIGHT - PhantomService.MARGIN - height;
    }

    private async init(): Promise<void>  {
        this.instance = await phantom.create();
        this.page = await this.instance.createPage();
        this.page.setting('dpi', '72');
        this.page.property('viewportSize', { width: PhantomService.WIDTH, height: PhantomService.HEIGHT });
    }

}
