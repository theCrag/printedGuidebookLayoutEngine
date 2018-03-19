import { plainToClass } from 'class-transformer';
import * as request from 'request';
import { Require, Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { Area } from '../models/Area';
import { Route } from '../models/Route';

@Service()
export class CragJsonApiService {

    private httpRequest: typeof request;

    constructor(
        @Require('request') r: any,
        @Logger(__filename) private log: LoggerInterface
    ) {
        this.httpRequest = r;
    }

    public async loadNode(nodePath: string): Promise<any> {
        this.log.info(`Load node ${nodePath}`);
        const node = await this.requestNode(nodePath, 'root');
        const area = plainToClass(Area, node.data as {});
        const { subAreas, routes } = await this.requestAreaChildren(area);
        area.subAreas = subAreas;
        area.routes = routes;
        return area;
    }

    private async requestAreaChildren(area: Area): Promise<any> {
        this.log.info('requestAreaChildren----------------------');
        this.log.info('requestAreaChildren', area.id, area.name, area.type);
        const queue = [];
        for (const child of area.children) {
            queue.push(this.requestNode(child.url, child.type));
        }
        const childNodes = await Promise.all(queue);

        const routes = childNodes
            .filter(childNode => childNode.data.type === 'route')
            .map(childNode => plainToClass(Route, childNode.data as {}));

        let subAreas = childNodes
            .filter(childNode => childNode.data.type === 'area')
            .map(childNode => plainToClass(Area, childNode.data as {}));

        subAreas = await this.requestSubAreas(subAreas);

        return { subAreas, routes };
    }

    private async requestSubAreas(areas: Area[]): Promise<any> {
        for (const area of areas) {
            const { subAreas, routes } = await this.requestAreaChildren(area);
            area.subAreas = subAreas;
            area.routes = routes;
        }
        return areas;
    }

    private requestNode(nodePath: string, type: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpRequest({
                method: 'GET',
                url: `https://www.thecrag.com/climbing/${nodePath}/json?key=${env.api.key}`,
            }, (error: any, response: request.RequestResponse, body: any) => {
                // Verify if the requests was successful and append user
                // information to our extended express request object
                if (!error) {
                    if (response.statusCode === 200) {
                        const data = JSON.parse(body);
                        return resolve(data);
                    }
                    this.log.info('requestNode----------------------');
                    this.log.info('requestNode', type);
                    this.log.info('requestNode', `https://www.thecrag.com/climbing/${nodePath}/json?key=${env.api.key}`);
                    return reject(body);
                }
                return reject(error);
            });
        });
    }

}
