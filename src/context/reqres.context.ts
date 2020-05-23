import { Request, Response } from 'express';

export interface ReqRes {
    req: Request;
    res: Response;
    payload?: {
        userId: string;
        userEmail: string;
    };
}
