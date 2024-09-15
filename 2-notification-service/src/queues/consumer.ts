import { config } from '@notifications/config';
import { winstonLogger } from '@nrv23/jobber-shared';
import { ConsumeMessage, Channel } from 'amqplib';
import { Logger } from 'winston';


const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`, 'email consumer ', 'debug');

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {

    try {

        const exchangeName = 'jobber-email-notification';
        const routingkey = 'auth-email';
        const queueName = 'auth-email-queue';

        await channel.assertExchange(exchangeName, 'direct');
        const { queue } = await channel.assertQueue(queueName, {
            durable: true,
            autoDelete: false // que se elimine una vez qye se marque como procesado
            
        });

        await channel.bindQueue(queue,exchangeName,routingkey);

        channel.consume(queue,async (msg: ConsumeMessage | null) => {
            console.log(JSON.parse(msg!.content.toString()));
        },{
            noAck: false
        });

        // send emails

        // ack message
    } catch (error) {
        log.log('error', 'NotificationService error Consumer consumeAuthEmailMessages method()', error);

    }
}

export { consumeAuthEmailMessages };