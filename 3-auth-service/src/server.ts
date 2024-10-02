import http from 'http';

import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@nrv23/jobber-shared';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { connect } from '@auth/elasticsearch';
import { appRoutes } from '@auth/routes';
import { databaseConnection } from '@auth/database';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'Authentication Server', 'debug');
const SERVER_PORT = config.SERVER_PORT!;


export async function start(app: Application): Promise<void> {
    securityMiddleware(app);
    standardMiddlware(app);
    routesMiddleware(app);
    await startQueues(); // conectar con rabbitmq
    await startElasticSearch(); // conectar con elasticsearch para ver los logs
    authErrorHanlder(app);
    startServer(app);
    await startDatabaseConnection();
}


function securityMiddleware(app: Application) {
    app.set('trust proxy', 1);
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
        origin: [config.API_GATEWAY_URL!],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE']
    }));

    app.use((req: Request, _res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            const { authorization } = req.headers;
            const token = authorization.split(' ')[1];
            const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
            req.currentUser = payload;
        }

        next();
    });
}

function standardMiddlware(app: Application): void {
    app.use(compression()); // comprirmir los request entrantes 
    app.use(json({
        limit: '200mb' // permitir un tamaño maximo de 200 megas por peticion
    })); //
    app.use(urlencoded({
        extended: true,
        limit: '200mb'
    }));
} 

function routesMiddleware(app: Application): void {
    appRoutes(app);
}

async function startQueues(): Promise<void> {

}

async function startElasticSearch(): Promise<void> {
   await connect();
}

function authErrorHanlder(app: Application): void {
    app.use('*', (error: IErrorResponse, _: Request, res: Response, next: NextFunction) => {

        log.log('error', `AuthenticationService ${error.comingFrom}`, error);
        if (error instanceof CustomError) {
            res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
    });
}

function startServer(app: Application): void {
    try {
        const httpServer = new http.Server(app);
        log.info(`Worker with processId ${process.pid} on auth server has started `);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Authentication server is running on port ${SERVER_PORT}`);
        });
    } catch (error) {
        log.log('error', 'AuthenticationService startServer() method error', error); 
    }
}

async function startDatabaseConnection(): Promise<void> {
    await databaseConnection();
}