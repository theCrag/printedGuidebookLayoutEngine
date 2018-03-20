import { plainToClass } from 'class-transformer';
import * as request from 'request';
import { Require, Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { Area } from '../models/Area';

@Service()
export class CragJsonApiService {

    private httpRequest: typeof request;

    constructor(
        @Require('request') r: any,
        @Logger(__filename) private log: LoggerInterface
    ) {
        this.httpRequest = r;
    }

    public async loadNode(nodePath: string): Promise<Area> {
        this.log.info(`Load node ${nodePath}`);
        const node = await this.requestNode(nodePath);
        const area = plainToClass(Area, node.data as {});
        return area;
    }

    private requestNode(nodePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpRequest({
                method: 'GET',
                url: `${env.api.url}/${nodePath}/guide/json?key=${env.api.key}`,
            }, (error: any, response: request.RequestResponse, body: any) => {
                // Verify if the requests was successful and append user
                // information to our extended express request object
                if (!error) {
                    if (response.statusCode === 200) {
                        const data = JSON.parse(body);
                        return resolve(data);
                    }
                    return reject(body);
                }
                return reject(error);
            });
        });
    }

}
