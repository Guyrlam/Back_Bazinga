import { Request, Response } from "express";
import UserServ from "../service/user";
import {EmailValidator} from "../helpers/validator"
import { LoginValidator, UserValidator } from "../validators/user";
import { ILogin, IUser } from "../interface";
import APIResponse from "../util/apiResponse";
const service = new UserServ();
const apiResponse = new APIResponse()

class UserControl{

    async registerUser(req: Request, res: Response) {
        const userdata: IUser = req.body;
        try {
            validateRegister(userdata)
            const dt = await service.register(userdata)
            res.json(dt)
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res,err.err,err.status)
        }
    }
    async login(req: Request, res: Response) {
        const userdata: ILogin = req.body;
        try {
            const sess:any = req.session;
            const { nick,email, password } = userdata;
            validateLogin(userdata)
            const dt = await service.login(userdata)
            if (dt) {
                if (nick) sess.nick = nick;
                if (email) sess.email = email;
                sess.password = password;
            }
            res.json(dt)
        } catch (err: any) {
            console.log(err);
            
            apiResponse.error(res,err.err,err.status)
        }
    }
    async getUsers(req: Request, res: Response) {
        try {
            const sess:any = req.session;
            if (sess.email || sess.nick) {
                const data:ILogin = {
                    password: sess.password,
                    email: sess.email,
                    nick: sess.nick
                }
                const dt = await service.login(data)
                res.json(dt)
            } else {
                throw {err:new Error('Não Autorizado'), status:401}
            }
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res,err.err,err.status)
        }
    }

}
function validateRegister(_data: IUser) {
    const validator = new UserValidator(_data);
    if (validator.errors) {
        console.log(validator.errors);
        throw {err:new Error(validator.errors),status:401};
    }
}
function validateLogin(_data: ILogin) {
    const validator = new LoginValidator(_data);
    if (validator.errors) {
        console.log(validator.errors);
        throw {err:new Error(validator.errors),status:401};
    }
}

export default UserControl;