import { Request, Response } from "express";
export declare const run: (_req: Request, res: Response) => void;
export declare const registerUser: (req: Request, res: Response) => Promise<void>;
export declare const loginUser: (req: Request, res: Response) => Promise<void>;
