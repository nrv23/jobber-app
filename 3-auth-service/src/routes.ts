import { Application } from 'express';
import { config } from '@auth/config';
import { verifyGatewayRequest } from '@nrv23/jobber-shared';
import { authRoutes } from '@auth/routes/auth.routes';

export function appRoutes(app: Application) : void {
    app.use(config.BASE_PATH!,verifyGatewayRequest, authRoutes() );
}