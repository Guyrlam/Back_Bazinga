import { salt } from "../config";
import UserDB from "../models/user";
import { IUser } from "../schema/userSchema";
import bcrypt from 'bcrypt';
const db = new UserDB();

class UserServ{
    async register(_data: IUser) {
        try {
            const findByEmail = await db.getByEmail(_data.email)
            const findByNick = await db.getByNick(_data.nick)
            if (findByEmail.length) {
                throw new Error("Este email já esta cadastrado");
            }
            if (findByNick.length) {
                throw new Error("Este Nick já esta cadastrado");
            }
            _data.password = await hashPassword(_data.password) as string;
            const user = await db.register(_data)
            return user;
        } catch (err: any) {
            return {errserv:err.message};
        }
    }
    async getAll() {
        try {
            const users = await db.getAll()
            return users;
        } catch (err: any) {
            return {errserv:err.message};
        }
    }
}
async function hashPassword(plaintextPassword: string):Promise<string> {
    const hash:string = await bcrypt.hash(plaintextPassword, salt);
    return hash;
}

async function comparePassword(plaintextPassword: string, hash: string) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}
export default UserServ;