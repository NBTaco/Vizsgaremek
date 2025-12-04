import { Request, Response } from "express";

export const run = (port: number) => {
  return (req: Request, res: Response) => {
    res.send(`Server is running on port ${port}`);
  };
};