import { model } from 'mongoose'
import { IUser, userSchema } from '../schema/userSchema';

class UserDB{
    user: any;
    constructor() {
        this.user = model("User", userSchema);
    }
    async register(_data: IUser) {
        try {
            const data = await this.user.create(_data);
            return data;
        } catch (err: any) {
            throw Error(err.message);
        }
    }
    async getAll() {
        try { 
            const data = await this.user.find({});
            return data;
        } catch (err: any) {
            throw Error(err.message);
        }
    }
    async getByEmail(_email:string) {
        try {
            const data = await this.user.find({ email: _email});
            return data;
        } catch (err: any) {
            throw Error(err.message);
        }
    }
    async getByNick(_nick:string) {
        try {
            const data = await this.user.find({ nick: _nick});
            return data;
        } catch (err: any) {
            throw Error(err.message);
        }
    }
}

export default UserDB;