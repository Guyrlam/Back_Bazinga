import { Request, Response } from 'express';
import UserServ from '../service/user';
import { EmailValidator } from '../helpers/validator';
import { LoginValidator, UserValidator } from '../validators/user';
import { ILogin, IUser } from '../interface';
import APIResponse from '../util/apiResponse';
import jwt from 'jsonwebtoken';
import { salt } from '../config';
import { CustomRequest } from '../interface/IRequest';
const service = new UserServ();
const apiResponse = new APIResponse();

class UserControl {
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
                { expiresIn: '1h' }
            );
            res.cookie('token', token, {
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
            if ((req as CustomRequest).token) {
                const dt = await service.getAll();
                res.json({ dt, token: (req as CustomRequest).token });
            } else {
                throw { err: new Error('Não Autorizado'), status: 401 };
            }
        } catch (err: any) {
            console.log(header['Authorization']);
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

export default UserControl;
