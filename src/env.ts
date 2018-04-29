import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import { getOsEnv, normalizePort, toBool, toNumber } from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });

/**
 * Environment variables
 */
export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
        dirs: {
            migrations: [path.relative(path.join(process.cwd()), path.join(__dirname, 'database/migrations/*.ts'))],
            migrationsDir: path.relative(path.join(process.cwd()), path.join(__dirname, 'database/migrations')),
            entities: [path.relative(path.join(process.cwd()), path.join(__dirname, 'api/**/models/*{.js,.ts}'))],
            subscribers: [path.join(__dirname, 'api/**/*Subscriber{.js,.ts}')],
            controllers: [path.join(__dirname, 'api/**/*Controller{.js,.ts}')],
            middlewares: [path.join(__dirname, 'api/**/*Middleware{.js,.ts}')],
            interceptors: [path.join(__dirname, 'api/**/*Interceptor{.js,.ts}')],
            queries: [path.join(__dirname, 'api/**/*Query{.js,.ts}')],
            mutations: [path.join(__dirname, 'api/**/*Mutation{.js,.ts}')],
        },
    },
    page: {
        height: toNumber(getOsEnv('PAGE_HEIGHT')),
        width: toNumber(getOsEnv('PAGE_WIDTH')),
        format: getOsEnv('PAGE_FORMAT'),
    },
    api: {
        key: getOsEnv('API_KEY'),
        url: getOsEnv('API_URL'),
        imgUrl: getOsEnv('API_IMG_URL'),
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnv('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        file: getOsEnv('SWAGGER_FILE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
    },
    monitor: {
        enabled: toBool(getOsEnv('MONITOR_ENABLED')),
        route: getOsEnv('MONITOR_ROUTE'),
        username: getOsEnv('MONITOR_USERNAME'),
        password: getOsEnv('MONITOR_PASSWORD'),
    },
};
