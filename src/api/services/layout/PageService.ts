import { Service } from 'typedi';

import { PhantomService } from './PhantomService';

@Service()
export class PageService {

    private currentPageIndex = 0;
    private pages: string[][] = [[]];

    constructor(
        private phantomService: PhantomService
    ) {
        //
    }

    public async add(content: string): Promise<void> {
        if (!this.pages[this.currentPageIndex]) {
            this.pages[this.currentPageIndex] = [];
        }
        console.log('==================');
        console.log('currentPageIndex', this.currentPageIndex);
        console.log('length', this.pages[this.currentPageIndex].length);
        this.pages[this.currentPageIndex].push(content);

        const freeSpace = await this.getFreeSpace();
        if (freeSpace < 0) {
            try {
                // removeLast
                this.pages[this.currentPageIndex].pop();

                // addPageBreak
                this.currentPageIndex++;

                return await this.add(content);
            } catch (e) {
                console.log(e);
            }
        }
    }

    public async getFreeSpace(): Promise<number> {
        return this.phantomService.getFreeSpaceInHeight(this.getCurrentPageContent());
    }

    public getAll(): string {
        const allContent = this.pages.map(p => this.getPageWrapper(p.join(''))).join('');
        this.currentPageIndex = 0;
        this.pages = [[]];
        return allContent;
    }

    private getPageWrapper(content: string): string {
        return `<section class="page">${content}</section>`;
    }

    private getCurrentPageContent(): string {
        return this.getPageWrapper(`${this.pages[this.currentPageIndex].join('')}<div class="last-element"></div>`);
    }

}
