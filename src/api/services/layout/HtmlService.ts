import * as _ from 'lodash';
import { Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { Area } from '../models/Area';
import { Description } from '../models/Description';
import { Route } from '../models/Route';
import { Topo } from '../models/Topo';

@Service()
export class HtmlService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async generateHtmlFromArea(area: Area): Promise<string> {
        this.log.info(`generateHtmlFromArea ${area.name}`);
        const body = await this.buildArea(area);
        return this.buildHtmlSceleton(area, body);
    }

    public async getFirstPageOfArea(area: Area): Promise<string> {
        this.log.info(`generateHtmlFromArea ${area.name}`);
        const body = await this.buildAreaDesc(area);
        return this.buildHtmlSceleton(area, body);
    }

    private buildAreaDesc(area: Area, level: number = 0): string {
        level++;
        if (area.type === 'area') {
            return `<div id="${area.id}" class="area">
                    <div class="area-title"><h${level}>${area.name}</h${level}></div>
                    <div class="area-description">
                    ${(area.descriptions && area.descriptions.length > 0)
                    ? area.descriptions.map(this.buildAreaDescription.bind(this)).join('')
                    : ''}
                    </div>
                    <div class="area-description">
                    ${(area.descriptions && area.descriptions.length > 0)
                    ? area.descriptions.map(this.buildAreaDescription.bind(this)).join('')
                    : ''}
                    </div>
                    <div class="area-description">
                    ${(area.descriptions && area.descriptions.length > 0)
                    ? area.descriptions.map(this.buildAreaDescription.bind(this)).join('')
                    : ''}
                    </div>
                    <div class="empty">empty</div>
            </div>
            </div>`;
        }
        return '';
    }

    private buildArea(area: Area, level: number = 0): string {
        level++;
        if (area.type === 'area') {
            return `<div id="${area.id}" class="area">
                    <div class="area-title"><h${level}>${area.name}</h${level}></div>
                    <div class="area-description">
                    ${(area.descriptions && area.descriptions.length > 0)
                    ? area.descriptions.map(this.buildAreaDescription.bind(this)).join('')
                    : ''}
                    ${(area.geometry)
                    ? `<div class="area-map">Map</div>`
                    : ''}
                </div>
                <div class="area-topos">
                    ${(area.children && area.children.length > 0 && area.topos && area.topos.length > 0)
                    ? area.topos.map(this.buildAreaTopo.bind(this)).join('')
                    : ''}
                </div>
                <div class="area-children">
                    ${(area.children && area.children.length > 0)
                    ? area.children.map(a => this.buildArea(a, level)).join('')
                    : ''}
                </div>
                <div class="area-routes">
                ${(!area.subAreaCount === true && area.topos && area.topos.length > 0)
                    ? this.buildRouteTopos(area.topos)
                    : ''}
            </div>
            </div>`;
        }
        return '';
    }

    private buildAreaDescription(description: Description): string {
        return `<p><b>${description.name}</b><br>${description.markdown}</p>`;
    }

    private buildTopoImage(topo: Topo): string {
        const a = topo.hashID.substring(0, 2);
        const b = topo.hashID.substring(2, 4);
        return `<img id="${topo.id}" src="${env.api.imgUrl}/${a}/${b}/${topo.hashID}">`;
    }

    private buildAreaTopo(topo: Topo): string {
        return `<div class="area-topo">${this.buildTopoImage(topo)}</div>`;
    }

    private buildRouteTopos(topos: Topo[]): string {
        let routes: Route[] = [];
        topos.forEach(t => t.routes.forEach(r => routes.push(r)));
        routes = _.unionBy(routes, 'id');

        return `<div class="route">
            ${routes.map((r, i) => `
                <p><b>${i + 1} - ${r.name}</b><br>
                ${(r.descriptions && r.descriptions.length > 0)
                    ? r.descriptions.map(d => `${d.markdown}`).join('<br>')
                    : ''}
                `).join('')}
        </div>`;
    }

    private buildHtmlSceleton(area: Area, body: string): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${area.name}</title>

    <style>
        body {
            margin: 0;
        }
        * {
            margin: 0 !important;
            padding: 0 !important;
        }
        .area-map {
            background: green;
            width: 200px;
            height: 200px;
        }
        .area-topo > img {
            width: 200px;
        }
    </style>
</head>
<body>
    ${body}
</body>
</html>`;
    }

}
