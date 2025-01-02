import crypto from 'crypto';

import { changePasswordSchema, emailSchema, passwordSchema } from '@auth/schemes/password.schema';
import { loginSchema } from '@auth/schemes/signin.schema';
import { getAuthUserById, getAuthUserByVerificationToken, signToken, updateVerifyEmailField, getUserByEmail, getAuthUserByPasswordToken, updatePassword, getUserByUsername } from '@auth/services/auth.service';
import { comparePass } from '@auth/utils/comparePass';
import { existsUser } from '@auth/utils/existsUser';
import { handleError } from '@auth/utils/handleError';
import { BadRequestError, IAuthDocument, IEmailMessageDetails } from '@nrv23/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';
import { config } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import AuthModel from '@auth/models/auth.schema';


export async function read(req: Request, res: Response): Promise<void> {

    try {

        const { error } = await Promise.resolve(loginSchema.validate(req.body));
        if (error?.details) {
            throw new BadRequestError(error.details[0].message, 'signin read() method error');
        }

        const { username, password } = req.body;
        const user = await existsUser(username);

        if (!user) {
            throw new BadRequestError('Invalid credentials', 'signin read() method error');
        }

        const matched: boolean = await comparePass(password, user);

        if (!matched) {
            throw new BadRequestError('Invalid credentials', 'signin read() method error');
        }

        const userJWT = signToken(user.id!, user.email!, user.username!);
        const userData: IAuthDocument = omit(user, ['password']);
        res.status(StatusCodes.OK).json({ message: 'User login successfully', user: userData, token: userJWT });
    } catch (error) {
        const customError = handleError(error);
        res.status(customError.getError().statusCode).json(error);
    }

}
export async function update(req: Request, res: Response): Promise<void> {

    try {

        const { token } = req.body;
        const checkIfUserExits: IAuthDocument = await getAuthUserByVerificationToken(token);

        if (!checkIfUserExits) {
            throw new BadRequestError('Invalid verification token', 'verifyEmail update() method error');
        }

        if (checkIfUserExits.emailVerified) {
            throw new BadRequestError('Email already verified', 'verifyEmail update() method error');
        }

        await updateVerifyEmailField(checkIfUserExits.id!, 1, checkIfUserExits.emailVerificationToken!);
        const updatedUser = await getAuthUserById(checkIfUserExits.id!);

        res.status(200).json({ message: 'Email verified successfully', user: updatedUser });
    } catch (error) {
        const customError = handleError(error);
        res.status(customError.getError().statusCode).json(error);
    }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
    try {
        const { error } = await Promise.resolve(emailSchema.validate(req.body));
        if (error?.details) {
            throw new BadRequestError(error.details[0].message, 'Password forgotPassword() method error');
        }

        const { email } = req.body;
        const user: IAuthDocument = await getUserByEmail(email);
        if (!user) {
            throw new BadRequestError('Invalid credentials', 'Password forgotPassword() method error');
        }

        // generar el link para resetear la contraseña

        const randmonBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
        const randomCharacters: string = randmonBytes.toString('hex');
        const date: Date = new Date();
        date.setHours(date.getHours() + 1);

        // actualiza el tiempo de vigencia del token

        await updateVerifyEmailField(user.id!, 1, randomCharacters);
        const resetLink = `${config.CLIENT_URL}/reset_password?v_token=${randomCharacters}`;
        const messageDetails: IEmailMessageDetails = {
            receiverEmail: user.email,
            resetLink,
            username: user.username,
            template: 'forgotPassword'
        };

        // publicar en la cola de mensajes
        await publishDirectMessage(
            authChannel,
            'jobber-email-notification',
            'auth-email',
            JSON.stringify(messageDetails),
            'Forgot password message has been sent to notification service'
        );
        res.status(StatusCodes.OK).json({ message: 'Reset password link has been sent to your email' });
    } catch (error) {
        const customError = handleError(error);
        res.status(customError.getError().statusCode).json(error);
    }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
    try {
        const { error } = await Promise.resolve(passwordSchema.validate(req.body));
        if (error?.details) {
            throw new BadRequestError(error.details[0].message, 'Password reset() method error');
        }

        const { password, confirmPassword } = req.body;
        const { token } = req.params;

        if (password !== confirmPassword) {
            throw new BadRequestError('Passwords do not match', 'Password reset() method error');
        }

        const user: IAuthDocument = await getAuthUserByPasswordToken(token);

        if (!user) {
            throw new BadRequestError('Reset token is expired', 'Password reset() method error');
        }

        const newPassword = await AuthModel.prototype.hassPassword(password as string);
        await updatePassword(user.id!, newPassword);

        const messageDetails: IEmailMessageDetails = {
            username: user.username,
            template: 'resetPasswordSuccess'
        };

        // publicar en la cola de mensajes
        await publishDirectMessage(
            authChannel,
            'jobber-email-notification',
            'auth-email',
            JSON.stringify(messageDetails),
            'Reset password successfuly has been sent to notification service'
        );
        res.status(StatusCodes.OK).json({ message: 'Password successfully updated' });

    } catch (error) {
        const customError = handleError(error);
        res.status(customError.getError().statusCode).json(error);
    }

}

export async function changePassword(req: Request, res: Response): Promise<void> { // usa token
    try {
        // debe estar logueado para usar este servicio
        const { error } = await Promise.resolve(changePasswordSchema.validate(req.body));
        if (error?.details) {
            throw new BadRequestError(error.details[0].message, 'Password reset() method error');
        }

        const { currentPassword, newPassword } = req.body;
        const user: IAuthDocument = await getUserByUsername(`${req.currentUser?.username}`);

        if (!user) {
            throw new BadRequestError('Invalid token', 'Password reset() method error');
        }

        const matched: boolean = await comparePass(currentPassword, user);

        if (!matched) {
            throw new BadRequestError('Invalid credentials', 'signin read() method error');
        }

        const passwordHashed = await AuthModel.prototype.hassPassword(newPassword);
        await updatePassword(user.id!, passwordHashed);

        const messageDetails: IEmailMessageDetails = {
            username: user.username,
            template: 'resetPasswordSuccess'
        };

        // publicar en la cola de mensajes
        await publishDirectMessage(
            authChannel,
            'jobber-email-notification',
            'auth-email',
            JSON.stringify(messageDetails),
            'Password changed successfuly has been sent to notification service'
        );
        res.status(StatusCodes.OK).json({ message: 'Password successfully updated' });

    } catch (error) {
        const customError = handleError(error);
        res.status(customError.getError().statusCode).json(error);
    }

}
// --------------------------------------------------------------------------------------------
export async function getCurrentUser(req: Request, res: Response): Promise<void> { // usa token
    try {
       
        let existingUser: IAuthDocument | null = null;
        const user: IAuthDocument = await getAuthUserById(req.currentUser!.id);

        if(!user) {
            throw new BadRequestError('Invalid username', 'getCurrentUser() method error');
        }

        if (user && Object.keys(user).length) {
            existingUser = user;
        }

        res.status(StatusCodes.OK).json({ message: 'User Authenticated', user: existingUser });

    } catch (error) {
        const customError = handleError(error);
        res.status(customError.getError().statusCode).json(error);
    }
}

export async function resendEmail(req: Request, res: Response): Promise<void> {
    try {

        const { email, userId } = req.body;
        const user : IAuthDocument = await getUserByEmail(email);

        if(!user) {
            throw new BadRequestError('Invalid email', 'resendEmail() method error');
        }
        
        const randmonBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
        const randomCharacters: string = randmonBytes.toString('hex');
        await updateVerifyEmailField(user.id!, 0, randomCharacters);
        const verifyLink = `${config.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;
        await updateVerifyEmailField(Number.parseInt(userId), 0, randomCharacters);
        const messageDetails: IEmailMessageDetails = {
            receiverEmail: user.email?.toLocaleLowerCase(),
            verifyLink,
            template: 'verifyLink'
        };

        // publicar en la cola de mensajes
        await publishDirectMessage(
            authChannel,
            'jobber-email-notification',
            'auth-email',
            JSON.stringify(messageDetails),
            'Verify email message has been sent to notification service'
        );
        const updatedUser = await getAuthUserById(Number.parseInt(userId));
        res.status(StatusCodes.OK).json({ message: 'Email verification sent', user: updatedUser });
   
    } catch (error) {
        const customError = handleError(error);
        res.status(customError.getError().statusCode).json(error);
    }
}