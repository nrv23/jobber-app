import { Application } from 'express';
import { healthyRoutes } from '@gateway/routes/healthy.route';

export const appRoutes = (app: Application) => {

    app.use('/api/v1/',healthyRoutes.routes());
}; 