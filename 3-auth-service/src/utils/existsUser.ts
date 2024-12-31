import { getUserByUsername, getUserByEmail } from '@auth/services/auth.service';
import { IAuthDocument, isEmail } from '@nrv23/jobber-shared';

async function existsUser(username: string) {

    const user : IAuthDocument = isEmail(username) 
        ? await getUserByEmail(username) 
        : await getUserByUsername(username);
    
    return user;
}

export {
    existsUser
};