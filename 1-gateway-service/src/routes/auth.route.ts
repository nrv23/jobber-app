import { Signup } from '@gateway/controller/auth/signup';
import express, { Router } from 'express';


class AuthRoutes {

    private router: Router;
    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post('/auth/signup', Signup.prototype.create); // otra forma de llamar una funcion de controlador

        return this.router;
    }
}

export const authRoutes: AuthRoutes = new AuthRoutes();