import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { winstonLogger } from '@nrv23/jobber-shared';
import { Application } from 'express';
import { Channel } from 'amqplib';

import { consumeAuthEmailMessages, consumeOrderEmailMessages } from './queues/consumer';
import { config } from './config';
import { healthRoutes } from './routes';
import { connect } from './elasticsearch';
import { createConnection } from './queues/connection';

const SERVER_PORT = config.configProperties.SERVER_PORT;
const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`,'notifiactionServer','debug');

async function startQueues(): Promise<void> {
    // se cargan las funciones para escuchar los mensajes que vienen en la cola
    const channel: Channel = await createConnection() as Channel;
    await consumeAuthEmailMessages(channel!);
    await consumeOrderEmailMessages(channel!);

    /*const verifyLink = `${config.configProperties.CLIENT_URL}/confirm_email?v_token=1323123123`;
    const messageDetails: IEmailMessageDetails = {
        verifyLink,
        template:'verifyEmail',
        receiverEmail: `${config.configProperties.SENDER_EMAIL}`
    };

    await channel.assertExchange('jobber-email-notification','direct');
    const message = JSON.stringify({messageDetails});
    channel.publish('jobber-email-notification','auth-email', Buffer.from(message));*/
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