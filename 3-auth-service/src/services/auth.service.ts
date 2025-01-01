import { config } from '@auth/config';
import AuthModel from '@auth/models/auth.schema';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { firstLetterUppercase, IAuthBuyerMessageDetails, IAuthDocument } from '@nrv23/jobber-shared';
import { sign } from 'jsonwebtoken';
import { omit, lowerCase } from 'lodash';
import { Model, Op } from 'sequelize';

export async function createAuthUser(data: IAuthDocument): Promise<IAuthDocument> {

    const result: Model = await AuthModel.create(data);
    const messageDetails: IAuthBuyerMessageDetails = {
        username: result.dataValues.username!,
        email: result.dataValues.email!,
        profilePicture: result.dataValues.profilePicture!,
        country: result.dataValues.country!,
        createdAt: result.dataValues.createdAt!,
        type: 'auth',
    };

    await publishDirectMessage(authChannel, config.EXCHANGE_NAME!, config.ROUTING_KEY!, JSON.stringify(messageDetails), 'Buyer details sent to buyer service');
    const userResponse: IAuthDocument = omit(result.dataValues, ['password']) as IAuthDocument;// funcion para omitir una propiedad del objeto

    return userResponse;
}

export async function getAuthUserById(id: number): Promise<IAuthDocument> {
    const user: Model<IAuthDocument> = await AuthModel.findOne({
        where: { id },
        attributes: {
            exclude: ['passowrd']
        }
    }) as Model;

    return user.dataValues;
}


export async function getAuthUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const user: Model<IAuthDocument> = await AuthModel.findOne({
        where: {
            [Op.or]: [{ username: firstLetterUppercase(username) }, { email: lowerCase(email) }]
        }
    }) as Model;

    return user?.dataValues;
}

export async function getUserByUsername(username: string): Promise<IAuthDocument> {
    const user: Model<IAuthDocument> = await AuthModel.findOne({
        where: { username: firstLetterUppercase(username) }
    }) as Model;

    return user.dataValues;
}

export async function getUserByEmail(email: string): Promise<IAuthDocument> {
    const user: Model<IAuthDocument> = await AuthModel.findOne({
        where: { email: email.toLowerCase() }
    }) as Model;

    return user?.dataValues;
}


export async function getAuthUserByVerificationToken(token: string): Promise<IAuthDocument> {
    const user: Model<IAuthDocument> = await AuthModel.findOne({
        where: { emailVerificationToken: token },
        attributes: {
            exclude: ['passowrd']
        }
    }) as Model;

    return user.dataValues;
}


export async function getAuthUserByPasswordToken(token: string): Promise<IAuthDocument> {
    const user: Model<IAuthDocument> = await AuthModel.findOne({
        where: {
            [Op.and]: [{ passwordResetToken: token }, {
                passwordResetExpires: {
                    [Op.gt]: new Date()
                }
            }]
        }
    }) as Model;

    return user.dataValues;
}


export async function updateVerifyEmailField(id: number, emailVerified: number, emailVerificationToken: string): Promise<void> {
    await AuthModel.update({
        emailVerificationToken,
        emailVerified
    },
        {
            where: { id }
        }
    );
} 

export async function updatePasswordToken(id: number, token: string, tokenExpiration: Date): Promise<void> {
    await AuthModel.update({
        passwordResetToken: token,
        passwordResetExpires: tokenExpiration
    },
        {
            where: { id }
        }
    );
} 

export async function updatePassword(id: number, newPass: string): Promise<void> {
    await AuthModel.update({
        passwordResetToken: '',
        passwordResetExpires: new Date(),
        password: newPass
    },
        {
            where: { id }
        }
    );
} 


export function signToken(id: number, email: string, username: string): string {
    
    return sign({id, email, username},config.JWT_TOKEN!);
} 