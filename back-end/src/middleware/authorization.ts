import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { UserInfo } from "../routes/user";

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // const { authorization } = req.headers;
    // const token = authorization?.split(' ')[1];
    

}

export interface AuthRequest extends Request {
    user?: any;
  }
  

