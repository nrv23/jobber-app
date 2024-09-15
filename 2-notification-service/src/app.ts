import { winstonLogger } from '@nrv23/jobber-shared';
import { Logger } from 'winston';
import express, { Express } from 'express';

import { config } from './config';
import { start } from './server';

const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`,'notificationApp ','debug');

function initialize (): void {

    const app: Express = express();
    start(app);
    log.info('Notification Service is started');
}
initialize();