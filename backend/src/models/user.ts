import { model } from 'mongoose'
import { userSchema } from '../schema/userSchema';
import { IUser, IUserUpd } from '../interface';

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
            throw err;
        }
    }
    async getAll() {
        try { 
            const data = await this.user.find({});
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async getByEmail(_email:string) {
        try {
            const data = await this.user.find({ email: _email});
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async getByNick(_nick:string) {
        try {
            const data = await this.user.find({ nick: _nick});
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async update(_id:string, user: IUserUpd) {
        try {
            let dataUpt: IUserUpd={};
            if (user.email) dataUpt.email = user.email;
            if (user.name) dataUpt.name = user.name;
            if (user.nick) dataUpt.nick = user.nick;
            if (user.password) dataUpt.password = user.password;
            const data = await this.user.updateOne({ _id: _id }, dataUpt);
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async getById(_id:string) {
        try {
            const data = await this.user.findById(_id);
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async removeId(_id:string) {
        try {
            const data = await this.user.deleteOne({ _id: _id });
            return {message:"ok"};
        } catch (err: any) {
            throw err;
        }
    }
}

export default UserDB;