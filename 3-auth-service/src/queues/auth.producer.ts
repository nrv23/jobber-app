import { winstonLogger } from '@nrv23/jobber-shared';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { Channel } from 'amqplib';
import { createConnection } from '@auth/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'AuthServiceProducer ', 'debug');

export async function publishDirectMessage(
    channel: Channel,
    exchangeName: string,
    routingKey: string,
    message: string,
    logMessage: string
): Promise<void> {

    try {
        if (!channel) { channel = await createConnection() as Channel; }


        await channel.assertExchange(exchangeName,'direct');

        // publica el mensaje
        channel.publish(exchangeName,routingKey, Buffer.from(message));
        log.info(logMessage);
    } catch (error) {
        log.log('error', 'AuthService Provider publishDirectMessage() method error', error);
    }
}
