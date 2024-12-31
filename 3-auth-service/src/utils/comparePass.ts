import AuthModel from '@auth/models/auth.schema';
import { IAuthDocument } from '@nrv23/jobber-shared';

async function comparePass(password: string, user: IAuthDocument): Promise<boolean> { 
    return await AuthModel.prototype.comparePassword(password, user.password!);
}
export {
    comparePass
};