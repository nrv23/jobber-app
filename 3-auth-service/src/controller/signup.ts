import crypto from 'crypto';

import { signupSchema } from '@auth/schemes/signup.scheme';
import { createAuthUser, getAuthUserByUsernameOrEmail, signToken } from '@auth/services/auth.service';
import { BadRequestError, firstLetterUppercase, IAuthDocument, IEmailMessageDetails, lowerCase } from '@nrv23/jobber-shared';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { config } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { StatusCodes } from 'http-status-codes';

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const { error } = await Promise.resolve(signupSchema.validate(req.body));

  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'signup controller');
  }

  const { username, email, password, country, profilePicture } = req.body;

  const checkIfUserExits: IAuthDocument = await getAuthUserByUsernameOrEmail(username, email);

  if (checkIfUserExits) {
    throw new BadRequestError('Invalid credentials . Email or Username ', 'signup controller create() method error');
  }

  const profilePublicId = uuid();
  
  const uploadResult: UploadApiResponse = (await config.cloudinaryConfig().uploads(profilePicture.replace(/^data:image\/\w+;base64,/, ''), `${profilePublicId}`, true, true)) as UploadApiResponse;

  if (!uploadResult.public_id) {
    throw new BadRequestError(`File upload error: ${JSON.stringify(uploadResult)}.  Try again`, 'signup controller create() method error');
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');

  // crear el registor de usuario

  const auhData: IAuthDocument = {
    username: firstLetterUppercase(username),
    email: lowerCase(email),
    profilePublicId,
    password,
    country,
    profilePicture: uploadResult?.secure_url,
    emailVerificationToken: randomCharacters
  } as IAuthDocument;

  const result: IAuthDocument = await createAuthUser(auhData);
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${auhData.emailVerificationToken}`;

  const messageDetails: IEmailMessageDetails = {
    receiverEmail: result.email,
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };

  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Verify email message has been sent to notification service'
  );

  const token: string = signToken(result.id!, result.email!, result.username!);
  res.status(StatusCodes.CREATED).json({
    message: 'User was created successfully',
    token,
    user: result
  });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
     error
    });
  }
}

