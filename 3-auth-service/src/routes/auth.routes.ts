import { Router } from 'express';
import { create } from '@auth/controller/signup';
const router: Router = Router();


export function authRoutes(): Router {
    
    router.post('/signup', create);
    // /api/auth/v1
    return router;
}