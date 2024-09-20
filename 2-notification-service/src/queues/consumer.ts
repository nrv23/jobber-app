import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@nrv23/jobber-shared';
import { ConsumeMessage, Channel } from 'amqplib';
import { Logger } from 'winston';

import { sendEmail } from './mail.transport';
//import { sendEmail } from './mail.transport';


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

        await channel.bindQueue(queue, exchangeName, routingkey);

        channel.consume(queue, async (msg: ConsumeMessage | null) => {
            console.log(JSON.parse(msg!.content.toString()));


            const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString()).messageDetails;

            // send emails
            const locals: IEmailLocals = {
                appLink: `${config.configProperties.CLIENT_URL}`,
                appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
                username,
                verifyLink,
                resetLink
            };
            await sendEmail(template, receiverEmail, locals);
            // ack message
            channel.ack(msg!);

        }, {
            noAck: false
        });


    } catch (error) {
        log.log('error', 'NotificationService error Consumer consumeAuthEmailMessages method()', error);

    }
}

async function consumeOrderEmailMessages(channel: Channel): Promise<void> {

    try {

        const exchangeName = 'jobber-order-notification';
        const routingkey = 'order-email';
        const queueName = 'order-email-queue';

        await channel.assertExchange(exchangeName, 'direct');
        const { queue } = await channel.assertQueue(queueName, {
            durable: true,
            autoDelete: false // que se elimine una vez qye se marque como procesado

        });

        await channel.bindQueue(queue, exchangeName, routingkey);

        channel.consume(queue, async (msg: ConsumeMessage | null) => {
            console.log(JSON.parse(msg!.content.toString()));

            const {
                receiverEmail,
                username,
                template,
                sender,
                offerLink,
                amount,
                buyerUsername,
                sellerUsername,
                title,
                description,
                deliveryDays,
                orderId,
                orderDue,
                requirements,
                orderUrl,
                originalDate,
                newDate,
                reason,
                subject,
                header,
                type,
                message,
                serviceFee,
                total
              } = JSON.parse(msg!.content.toString());
              const locals: IEmailLocals = {
                appLink: `${config.configProperties.CLIENT_URL}`,
                appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
                username,
                sender,
                offerLink,
                amount,
                buyerUsername,
                sellerUsername,
                title,
                description,
                deliveryDays,
                orderId,
                orderDue,
                requirements,
                orderUrl,
                originalDate,
                newDate,
                reason,
                subject,
                header,
                type,
                message,
                serviceFee,
                total
              };
              if (template === 'orderPlaced') {
                await sendEmail('orderPlaced', receiverEmail, locals);
                await sendEmail('orderReceipt', receiverEmail, locals);
              } else {
                await sendEmail(template, receiverEmail, locals);
              }

        }, {
            noAck: false
        });


    } catch (error) {
        log.log('error', 'NotificationService error Consumer consumeOrderEmailMessages method()', error);

    }
}

export { consumeAuthEmailMessages, consumeOrderEmailMessages };