import http from 'http';

import { CustomError, IErrorResponse, winstonLogger } from '@nrv23/jobber-shared';
import cookieSession from 'cookie-session';
import { Application, NextFunction, Request, Response, urlencoded, json } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import { Logger } from 'winston';
import compression from 'compression';
import { StatusCodes } from 'http-status-codes';
import { config } from '@gateway/config';

const SERVER_PORT = config.configProperties.SERVER_PORT;
const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');

export class GateWayServer {

    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }


    public start(): void {
        this.securityMiddlware(this.app);
        this.standardMiddlware(this.app);
        this.routesMiddleware();
        this.errorHandler(this.app);
        this.startElasticSearch();
        // inicia el servidor

        this.startServer(this.app);
    }

    private securityMiddlware(app: Application): void {
        app.set('trust proxy', 1);
        app.use(
            cookieSession({
                name: 'authSession',
                keys: [`${config.configProperties.SECRET_KEY_ONE}`, `${config.configProperties.SECRET_KEY_TWO}`], // palabras para firmar el cookie, esto viene del .env
                maxAge: 24 * 7 * 3600000, // el token expira en 7 dias
                secure: config.configProperties.NODE_ENV !== 'development', // value from config
                //sameSite: 'none', // enviar el token por la cookie como httpOnly
                //httpOnly: true
            })
        );

        app.use(hpp());
        /*

            El middleware hpp previene este tipo de ataques asegurándose de que cada parámetro tenga solo un valor. 
            Cuando encuentra múltiples valores para un mismo parámetro, el paquete elimina todos excepto el último por defecto.
        */

        app.use(helmet());
        app.use(cors({
            origin: config.configProperties.CLIENT_URL,
            credentials: true, // el token viene en el cookie y permite envio de cabeceras para autenticacion o certificados ssl
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }));
    }

    private standardMiddlware(app: Application): void {
        app.use(compression()); // comprirmir los request entrantes 
        app.use(json({
            limit: '200mb' // permitir un tamaño maximo de 200 megas por peticion
        })); //
        app.use(urlencoded({
            extended: true,
            limit: '200mb'
        }));
    }

    private routesMiddleware(): void {

    }

    private startElasticSearch(): void {

    }

    private errorHandler(app: Application): void {
        app.use('*', (req: Request, res: Response, next: NextFunction) => {

            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            log.log('error', `${fullUrl} does not exists`, '');
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                message: 'Method not allowed'
            });
            next();
        });

        app.use('*', (error: IErrorResponse, _: Request, res: Response, next: NextFunction) => {

            log.log('error', `GatewayService ${error.comingFrom}`, error);
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                message: 'Method not allowed'
            });

            if (error instanceof CustomError) {
                res.status(error.statusCode).json(error.serializeErrors());
            }
            next();
        });
    }

    private startServer(app: Application): void {
        try {
            const httpServer: http.Server = new http.Server(app);
            this.startHttpServer(httpServer);
        } catch (error) {
            log.log('error', 'GatewayService startServer() error method', error);
        }
    }

    private startHttpServer(httpServer: http.Server): void {
        try {
            log.info(`Worker with processId ${process.pid} on gateway server has started `);
            httpServer.listen(SERVER_PORT, () => {
                log.info(`gateway server running on port ${SERVER_PORT}`);
            });

        } catch (error) {
            log.log('error', 'GatewayService startHttpServer() error method', error);
            process.exit(1);
        }
    }
}