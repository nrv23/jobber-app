import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { winstonLogger } from '@nrv23/jobber-shared';
import { Application } from 'express';
import { Channel } from 'amqplib';

import { consumeAuthEmailMessages } from './queues/consumer';
import { config } from './config';
import { healthRoutes } from './routes';
import { connect } from './elasticsearch';
import { createConnection } from './queues/connection';

const SERVER_PORT = config.configProperties.SERVER_PORT;
const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`,'notifiactionServer','debug');

async function startQueues(): Promise<void> {
    const channel: Channel = await createConnection() as Channel;
    await consumeAuthEmailMessages(channel!);
}

async function startElasticSearch() : Promise<void> {
    await connect();
}

function startSerever(app: Application): void {
    try {

        const httpServer: http.Server = new http.Server(app);
        log.info(`Worker with process id of ${process.pid} on notification server has started`);

        httpServer.listen(SERVER_PORT, ( ) => {
            log.info(`Notification server is running on http://localhost:${SERVER_PORT}`);
        });

    } catch (error) {
        log.log('error','NotificationService startServer(): ', error);
        process.exit(1);
    }
}

export async function start(app: Application): Promise<void> {
    await startSerever(app);
    app.use('',healthRoutes);
    await startQueues();
    await startElasticSearch();
}