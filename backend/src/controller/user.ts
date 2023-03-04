import { Request, Response } from "express";
import { IUser } from "../schema/userSchema";
import UserServ from "../service/user";
import {EmailValidator} from "../helpers/validator"
import { UserValidator } from "../validators/user";
const service = new UserServ();

class UserControl{

    async registerUser(req: Request, res: Response) {
        const userdata: IUser = req.body;
        try {
            validateRegister(userdata)
            const dt = await service.register(userdata)
            res.json(dt)
        } catch (err: any) {
            console.log(err);
            
            res.json({ data: err.message, err: err.toString(), errCode: 500 });
        }
    }
    async getUsers(req: Request, res: Response) {
        try {
            const users = await service.getAll();
            res.json(users)
        } catch (err: any) {
            console.log(err)
        }
    }

}
function validateRegister(_data: IUser) {
    const validator = new UserValidator(_data);
    if (validator.errors) {
        console.log(validator.errors);
        throw new Error(validator.errors);
    }
}

export default UserControl;