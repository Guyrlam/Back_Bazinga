import { Request, Response } from "express";
import UserServ from "../service/user";
import { EmailValidator } from "../helpers/validator";
import { LoginValidator, UpdateValidator, UserValidator } from "../validators/user";
import { ILogin, IUser, IUserUpd } from "../interface";
import APIResponse from "../util/apiResponse";
import jwt from "jsonwebtoken";
import { salt } from "../config";
import { CustomRequest } from "../interface/IRequest";
const service = new UserServ();
const apiResponse = new APIResponse();

class UserControl {
    async getMy(req: Request, res: Response) {
        try {
            const token: any = (req as CustomRequest).token;
            const dt = await service.getId(token._id);
            res.json(dt);
        } catch (err: any) { 
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const dt = await service.delete(req.params.id);
            res.json(dt);
        } catch (err: any) { 
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }
    async registerUser(req: Request, res: Response) {
        const userdata: IUser = req.body;
        try {
            validateRegister(userdata);
            const dt = await service.register(userdata);
            res.json(dt);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }
    async logout(req: Request, res: Response) {
        try {
            res.clearCookie("token");
            res.json({
                auth: false,
            });
        } catch (err: any) {
            console.log(err);

            apiResponse.error(res, err.err, err.status);
        }
    }
    async update(req: Request, res: Response) {
        const userdata: IUserUpd = req.body;
        const token: any = (req as CustomRequest).token;
        try {
            validateUpdate(userdata);
            const upd: IUser = await service.update(token._id, userdata);
            const user: IUser = await service.getId(token._id);
            const newtoken = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    nick: user.nick,
                    email: user.email,
                },
                salt,
                { expiresIn: "1h" }
            );
            res.cookie("token", newtoken, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
            });
            res.json(user);
        } catch (err: any) {
            console.log(err);

            apiResponse.error(res, err.err, err.status);
        }
    }
    async login(req: Request, res: Response) {
        const userdata: ILogin = req.body;
        try {
            validateLogin(userdata);
            const user: IUser = await service.login(userdata);

            const token = jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    nick: user.nick,
                    email: user.email,
                },
                salt,
                { expiresIn: "1h" }
            );
            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
            });
            res.json({
                auth: true,
                token: token,
            });
        } catch (err: any) {
            console.log(err);

            apiResponse.error(res, err.err, err.status);
        }
    }
    async getUsers(req: Request, res: Response) {
        const header: any = req.header;
        try {
            if (req.query.search) {
                const data = await service.search(req.query.search as string);
                res.json(data);
            } else {
                const data = await service.getAll();
                res.json(data);
            }
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }
    async getSuggest(req: Request, res: Response) {
        const header: any = req.header;
        try {
            const data = await service.suggest(req.params.search);
            res.json(data);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }
}
function validateRegister(_data: IUser) {
    const validator = new UserValidator(_data);
    if (validator.errors) {
        console.log(validator.errors);
        throw { err: new Error(validator.errors), status: 401 };
    }
}
function validateLogin(_data: ILogin) {
    const validator = new LoginValidator(_data);
    if (validator.errors) {
        console.log(validator.errors);
        throw { err: new Error(validator.errors), status: 401 };
    }
}
function validateUpdate(_data: IUserUpd) {
    const validator = new UpdateValidator(_data);
    if (validator.errors) {
        console.log(validator.errors);
        throw { err: new Error(validator.errors), status: 401 };
    }
}

export default UserControl;
