import { Response } from "express";

export default class APIResponse{
    error(res: Response, err: any,status:number) {
        res.status(status).json({
            message: err.message,
        })
    }
}