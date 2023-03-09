import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { salt } from "../config";
import { CustomRequest } from "../interface/IRequest";
import APIResponse from "../util/apiResponse";
const apiResponse = new APIResponse();
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header("Authorization")?.replace('Bearer ','');
    try {
        if (!token) {
            throw {err:new Error("Não Autorizado"),status:401};
        }
        const decoded = (jwt.verify(token, salt) as JwtPayload);
        (req as CustomRequest).token = decoded;
        next();
    } catch (err:any) {
        apiResponse.error(res, err.err, err.status);
    }
};
