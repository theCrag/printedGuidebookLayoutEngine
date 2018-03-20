import { Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Area } from '../models/Area';

@Service()
export class HtmlService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async generateHtmlFromArea(area: Area): Promise<string> {
        this.log.info(`generateHtmlFromArea ${area.name}`);
        const body = await this.buildBodyFromArea(area);
        return this.buildHtmlSceleton(area, body);
    }

    private async buildBodyFromArea(area: Area): Promise<string> {
        return '';
    }

    private buildHtmlSceleton(area: Area, body: string): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${area.name}</title>
</head>
<body>
    ${body}
</body>
</html>`;
    }

}
