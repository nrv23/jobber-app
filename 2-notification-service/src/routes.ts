import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';


const router: Router = Router();

export function healthRoutes(): Router {
    router.get('/notification-health', (_: Request, res: Response) => {

        return res.status(StatusCodes.OK).json({
            message: 'Notificacion service is running'
        });
    });

    return router;
}