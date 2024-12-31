import { loginSchema } from '@auth/schemes/signin.schema';
import { signToken } from '@auth/services/auth.service';
import { comparePass } from '@auth/utils/comparePass';
import { existsUser } from '@auth/utils/existsUser';
import { BadRequestError, IAuthDocument } from '@nrv23/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';


export async function read(req: Request, res: Response): Promise<void> {


    const { error } = await Promise.resolve(loginSchema.validate(req.body));
    if (error?.details) {
        throw new BadRequestError(error.details[0].message, 'signin read() method error');
    }

    const { username, password } = req.body;
    const user = await existsUser(username);

    if (!user) {
        throw new BadRequestError('Invalid credentials', 'signin read() method error');
    }

    const matched : boolean = await comparePass(password, user);

    if(!matched) {
        throw new BadRequestError('Invalid credentials', 'signin read() method error');
    }

    const userJWT = signToken(user.id!, user.email!, user.username!);
    const userData : IAuthDocument = omit(user, ['password']);
    res.status(StatusCodes.OK).json({ message: 'User login successfully' , user: userData, token: userJWT });

}