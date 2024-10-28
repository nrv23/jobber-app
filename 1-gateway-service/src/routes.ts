import { Application } from 'express';
import { healthyRoutes } from '@gateway/routes/healthy.route';
import { authRoutes } from '@gateway/routes/auth.route';
import { config } from '@gateway/config';

export const appRoutes = (app: Application) => {

    app.use('/api/v1/',healthyRoutes.routes());
    app.use(config.configProperties.BASE_URL!,authRoutes.routes());
}; 