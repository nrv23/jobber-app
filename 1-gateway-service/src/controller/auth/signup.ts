import fs from 'fs';

import { authService } from '@gateway/services/api/auth.server';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FormData from 'form-data';

export class Signup {

    public async create(req: Request, res: Response): Promise<void> {
        try {
            console.log('Llegó aquí!', req);

            const formData = new FormData();

            formData.append('image', fs.createReadStream(req.file!.path),'image');
            formData.append('username', req.body.username);
            formData.append('email', req.body.email);
            formData.append('country', req.body.country);
            formData.append('password', req.body.password);

            const response: AxiosResponse = await authService.signUp({
                data: {
                    ...formData
                }
            });
            req.session = { jwt: response.data.token };

            res.status(StatusCodes.CREATED).json({
                message: response.data.message,
                user: response.data.user
            });
        } catch (error) {
            res.status(StatusCodes.CREATED).json({
                error
            });
        }
    }
}