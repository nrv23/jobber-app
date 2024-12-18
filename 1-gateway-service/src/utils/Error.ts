import { BadRequestError, CustomError, FileTooLargeError, NotAuthorizedError, NotFoundError, ServerError, ForbiddenError, MethodNotAllowedError } from '@nrv23/jobber-shared';


interface IBaseError {
    message: string;
    commingFrom: string;
    statusCode: number
}

class BaseError {
    private error: IBaseError;
    private customeError!: CustomError;
    constructor(error: IBaseError) {
        this.error = error;
    }

    getError(): CustomError {


        switch (this.error.statusCode) {
            case 400:
            case 422:
                this.customeError = new BadRequestError(this.error.message, this.error.commingFrom);
                break;
            case 403:
                this.customeError = new ForbiddenError(this.error.message, this.error.commingFrom);
                break;
            case 401:
                this.customeError = new NotAuthorizedError(this.error.message, this.error.commingFrom);
                break;
            case 413:
                this.customeError = new FileTooLargeError(this.error.message, this.error.commingFrom);
                break;
            case 405:
                this.customeError = new MethodNotAllowedError(this.error.message, this.error.commingFrom);
                break;
            case 404:
                this.customeError = new NotFoundError(this.error.message, this.error.commingFrom);
                break;
            case 503:
            case 500:
                this.customeError = new ServerError(this.error.message, this.error.commingFrom);
                break;
        }

        return this.customeError;
    }
}


export default BaseError;