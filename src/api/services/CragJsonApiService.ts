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

    public async loadNode(nodePath: string): Promise<any> {
        this.log.info(`Load node ${nodePath}`);
        const node = await this.requestNode(nodePath);
        const area = plainToClass(Area, node.data as {});
        const { subAreas } = await this.requestAreaChildren(area);
        area.subAreas = subAreas;
        // area.routes = routes;
        return area;
    }

    private async requestAreaChildren(area: Area): Promise<any> {
        if (!area.children) {
            return {};
        }

        const queue = [];
        for (const child of area.children) {
            if (child.type === 'area') {
                this.log.info(`Request child ${child.name} - ${child.type}`);
                queue.push(this.requestNode(child.url));
            }
        }
        const childNodes = await Promise.all(queue);

        // const routes = area.children
        //     .filter(childNode => childNode.type === 'route')
        //     .map(childNode => plainToClass(Route, childNode as {}));

        let subAreas = childNodes
            .filter(childNode => childNode.data.type === 'area')
            .map(childNode => plainToClass(Area, childNode.data as {}));

        subAreas = await this.requestSubAreas(subAreas);

        return { subAreas };
    }

    private async requestSubAreas(areas: Area[]): Promise<any> {
        for (const area of areas) {
            const { subAreas } = await this.requestAreaChildren(area);
            area.subAreas = subAreas;
            // area.routes = routes;
        }
        return areas;
    }

    private requestNode(nodePath: string): Promise<any> {
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
                    return reject(body);
                }
                return reject(error);
            });
        });
    }

}
