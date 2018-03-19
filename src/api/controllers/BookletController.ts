import * as express from 'express';
import { Get, JsonController, Req } from 'routing-controllers';

import { CragJsonApiService } from '../services/CragJsonApiService';

@JsonController('/booklet')
export class BookletController {

    constructor(
        private cragJsonApiService: CragJsonApiService
    ) { }

    @Get('/*')
    public async node(@Req() req: express.Request): Promise<any> {
        const nodePath = req.path.replace('/api/booklet/', '');
        return await this.cragJsonApiService.loadNode(nodePath);
    }

}
