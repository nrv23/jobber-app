import path from 'path';

import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@nrv23/jobber-shared';
import { Logger } from 'winston';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`, 'mailTransportHelper', 'debug');

async function emailTemplates(template: string, to: string, locals: IEmailLocals): Promise<void> {
    try {

        const smtpTransport: Transporter = nodemailer.createTransport({
            host: config.configProperties.HOST_EMAIL_SMTP,
            port: config.configProperties.HOST_EMAIL_PORT,
            auth: {
                user: config.configProperties.SENDER_EMAIL,
                pass: config.configProperties.SENDER_EMAIL_PASSWORD
            }
        });


        const email: Email = new Email({
            message: {
                from: `Jobber App <${config.configProperties.SENDER_EMAIL}>`
            },
            send: true,
            preview: false,
            transport: smtpTransport,
            views: {
                options: {
                    extension: 'ejs'
                }
            },
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    relativeTo: path.join(__dirname, '../build')
                }
            }
        });

        await email.send({
            template: path.join(__dirname, '..', 'src/emails', template),
            message: { to }, // a quien le envia el mensaje
            locals
        });

    } catch (error) {
        log.log('error','error emailTemplates() method',error);
    }
}

export { emailTemplates };