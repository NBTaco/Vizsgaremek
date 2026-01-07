import { Request, Response, NextFunction } from "express";
export interface TokenPayload {
    id: number;
    email: string;
    iat?: number;
    exp?: number;
}
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => void;
