import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';
import { IEmailLocals, winstonLogger } from '@nrv23/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`, 'mail.transport ', 'debug');

async function sendEmail(emailTemplate: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {

    try {
        // email template
        await emailTemplates(emailTemplate,receiverEmail,locals);
        log.info('Email sent successfully');
    } catch (error) {
        log.log('error', 'Error in sendEmail() method :', error);
    }
}


export { sendEmail };