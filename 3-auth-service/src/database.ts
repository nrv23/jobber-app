import { Logger } from 'winston';
import { winstonLogger } from '@nrv23/jobber-shared';
import { config } from '@auth/config';
import { Sequelize } from 'sequelize';
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'authDatabaseServer', 'debug');


export const sequelize = new Sequelize(config.MYSQL_DB!, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        multipleStatements: true // permite ejecutar varios queries al mismo tiempo en una sola consulta del orm
    }
});

export async function databaseConnection(): Promise<void> {

    try {
        await sequelize.authenticate();
        log.info('AuthService Mysql Database Connection has started');
    } catch (error) {
        log.error('Error trying connecting authService with mysql');   
        log.log('error','AuthService databaseConnection() method error',error);
        process.exit(1); 
    }
}