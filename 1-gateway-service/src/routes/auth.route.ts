import express, { Router } from 'express';
import AuthController from '@gateway/controller/auth.controller';
import uploadFile from '@gateway/middleware/auth-middleware.service';


class AuthRoutes {

    private router: Router;


    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post('/auth/signup', uploadFile, AuthController.registerUser); // otra forma de llamar una funcion de controlador
        this.router.post('/auth/signin', AuthController.siginUser); // otra forma de llamar una funcion de controlador
        this.router.patch('/auth/verify-email', AuthController.verifyEmail); // otra forma de llamar una funcion de controlador
        this.router.patch('/auth/forgot-password', AuthController.forgotPassword); // otra forma de llamar una funcion de controlador
        this.router.patch('/auth/reset-password/:token', AuthController.resetPassword); // otra forma de llamar una funcion de controlador

        return this.router;
    }
}

export const authRoutes: AuthRoutes = new AuthRoutes();