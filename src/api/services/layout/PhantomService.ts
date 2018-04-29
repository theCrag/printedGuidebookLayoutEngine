import * as phantom from 'phantom';
import { Service } from 'typedi';

import { Area } from '../../models/Area';
import { HtmlService } from './HtmlService';

// import { Logger, LoggerInterface } from '../../../decorators/Logger';

@Service()
export class PhantomService {

    public static WIDTH = 595;
    public static HEIGHT = 842;
    public static MARGIN = 0;
    public static FOOTER = 0;

    public static ViewportHeight(): number {
        return PhantomService.HEIGHT - (2 * PhantomService.MARGIN) - PhantomService.FOOTER;
    }

    public static ViewportWidth(): number {
        return PhantomService.WIDTH - (2 * PhantomService.MARGIN);
    }

    private instance: phantom.PhantomJS;
    private page: phantom.WebPage;

    constructor(
        private htmlService: HtmlService
        // @Logger(__filename) private log: LoggerInterface
    ) {
        this.init();
    }

    // public async getHeight(html: string, selector: string): Promise<any> {
    //     this.log.info('getHeight of ', selector);
    //     this.page.setContent(html, '');
    //     /* tslint:disable */
    //     return await this.page.evaluate(function (s) {
    //         return (document.querySelector(s) as any).clientHeight;
    //     }, selector);
    //     /* tslint:enable */
    // }

    // public async getFreeSpaceInHeight(html: string): Promise<any> {
    //     this.page.setContent(html, '');
    //     /* tslint:disable */
    //     let distanceToTop = await this.page.evaluate(function (s) {
    //         return (document.querySelector(s) as any).offsetTop;
    //     }, '.empty');
    //     /* tslint:enable */
    //     let pageAmount = 1;
    //     while (distanceToTop > PhantomService.ViewportHeight()) {
    //         distanceToTop = distanceToTop - PhantomService.ViewportHeight();
    //         pageAmount++;
    //     }
    //     return {
    //         height: PhantomService.ViewportHeight() - distanceToTop,
    //         pageAmount,
    //     };
    // }

    public async getFreeSpaceInHeight(content: string): Promise<number> {
        const htmlContent = this.htmlService.buildHtmlSkeleton(new Area(), content);
        this.page.setContent(htmlContent, '');
        /* tslint:disable */
        const distanceToTop = await this.page.evaluate(function (s) {
            return (document.querySelector(s) as any).offsetTop;
        }, '.last-element');
        /* tslint:enable */
        return PhantomService.ViewportHeight() - distanceToTop;
    }

    private async init(): Promise<void> {
        this.instance = await phantom.create();
        this.page = await this.instance.createPage();
        this.page.setting('dpi', '72');
        this.page.property('viewportSize', {
            width: PhantomService.ViewportWidth(),
            height: PhantomService.ViewportHeight(),
        });
    }

}
