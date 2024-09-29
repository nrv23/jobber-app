import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';


export class HealthyController {

    constructor() {
        
    }

    public healthy(_: Request, res: Response): void {
        res.status(StatusCodes.OK).send('Gateway service is running');
    }
}