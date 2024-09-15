import { config } from '@notifications/config';
import { winstonLogger } from '@nrv23/jobber-shared';
import client, {Connection, Channel} from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`,'NotificationQueueconnection ','debug');

async function createConnection() : Promise<Channel | undefined> {

    try {

        const connection : Connection = await client.connect(`${config.configProperties.RABBITMQ_ENDPOINT}`);
        const channel: Channel = await connection.createChannel();
        log.info('Notification service connected to queue successfully');
        closeConnection(channel, connection);
        return channel;
    } catch (error) {
        log.log('error','NotificationService createConnection() method ', error);
       
        return undefined;
    }
}


function closeConnection(channel: Channel, connection: Connection): void {
    process.once('SIGINT', async () => {
        await channel.close();
        await connection.close();
    });
}

export { createConnection };