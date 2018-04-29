import { Service } from 'typedi';

import { Area } from '../../models/Area';
import { PageService } from './PageService';

// import { Logger, LoggerInterface } from '../../../decorators/Logger';
@Service()
export class AreaBuilderService {

    constructor(
        // @Logger(__filename) private log: LoggerInterface
        private pageService: PageService
    ) {
        //
    }

    public async build(area: Area): Promise<string> {

        // title
        await this.pageService.add(area.html);

        // descriptions
        for (const description of area.descriptions) {
            await this.pageService.add(description.html);
        }

        return this.pageService.getAll();
    }

}
