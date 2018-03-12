import { Application } from 'express';
import * as http from 'http';
import { bootstrapMicroframework } from 'microframework-w3tec';

import { eventDispatchLoader } from '../../../src/loaders/eventDispatchLoader';
import { expressLoader } from '../../../src/loaders/expressLoader';
import { homeLoader } from '../../../src/loaders/homeLoader';
import { iocLoader } from '../../../src/loaders/iocLoader';
import { winstonLoader } from '../../../src/loaders/winstonLoader';

export interface BootstrapSettings {
    app: Application;
    server: http.Server;
}

export const bootstrapApp = async (): Promise<BootstrapSettings> => {
    const framework = await bootstrapMicroframework({
        loaders: [
            winstonLoader,
            iocLoader,
            eventDispatchLoader,
            expressLoader,
            homeLoader,
        ],
    });
    return {
        app: framework.settings.getData('express_app') as Application,
        server: framework.settings.getData('express_server') as http.Server,
    } as BootstrapSettings;
};
