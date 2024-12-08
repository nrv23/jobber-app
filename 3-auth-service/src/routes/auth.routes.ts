import { Router } from 'express';
import { create } from '@auth/controller/signup';
import { imageUploadMiddleware } from '@auth/middleware/uploadImage.middleware';
const router: Router = Router();


export function authRoutes(): Router {
    
    router.post('/signup',imageUploadMiddleware, create);
    // /api/auth/v1
    return router;
}