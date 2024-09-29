import { HealthyController } from '@gateway/controller/healthy.cotroller';
import express, { Router } from 'express';


class HealthyRoutes {

    private router: Router;
    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/gateway-health', HealthyController.prototype.healthy);

        return this.router;
    }
}

export const healthyRoutes: HealthyRoutes = new HealthyRoutes();