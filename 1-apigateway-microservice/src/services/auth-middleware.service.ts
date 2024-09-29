import { config } from '@gateway/config';
import { BadRequestError, IAuthPayload, NotAuthorizedError, winstonLogger } from '@nrv23/jobber-shared';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');


class AuthMiddleware {

    public verifyUser(req: Request, _res: Response, next: NextFunction) {

        if(req.session?.jwt) {
            throw new NotAuthorizedError('Token is not provided','GatewayService verifyUser() Method');
        }

        try {

            const payload: IAuthPayload =  verify(req.session?.jwt,`${config.configProperties.JWT_TOKEN}`) as IAuthPayload;
            req.currentUser = payload;
        } catch (error) {
            log.log('error','Invalid token error',error);
            throw new NotAuthorizedError('Invalid token','GatewayService verifyUser() Method');
        }

        next();
    }

    public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
        if(!req.currentUser) {
            throw new BadRequestError('Invalid Authentication', 'GatewayService checkAuthentication() Method');
        }

        next();
    }

}


export const authMiddleware : AuthMiddleware = new AuthMiddleware();