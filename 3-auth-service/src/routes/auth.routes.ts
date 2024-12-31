import { Router } from 'express';
import { create } from '@auth/controller/signup';
import { imageUploadMiddleware } from '@auth/middleware/uploadImage.middleware';
import { read } from '@auth/controller/signin';
const router: Router = Router();


export function authRoutes(): Router {
    
    router.post('/signup',imageUploadMiddleware, create);
    router.post('/signin', read);
    // /api/auth/v1
    return router;
}