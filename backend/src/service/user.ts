import { salt } from '../config';
import { ILogin, IUser } from '../interface';
import UserDB from '../models/user';
import bcrypt from 'bcrypt';
const db = new UserDB();

class UserServ {
    async register(_data: IUser) {
        try {
            const findByEmail = await db.getByEmail(_data.email);
            const findByNick = await db.getByNick(_data.nick);
            if (findByEmail.length) {
                throw new Error('Este email já esta cadastrado');
            }
            if (findByNick.length) {
                throw new Error('Este Nick já esta cadastrado');
            }
            _data.password = (await hashPassword(_data.password)) as string;
            const user = await db.register(_data);
            return user;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async login(_user: ILogin) {
        try {
            let user;
            const findByEmail = await db.getByEmail(_user.email || '');
            const findByNick = await db.getByNick(_user.nick || '');

            if (findByEmail.length) {
                user = findByEmail[0];
            } else if (findByNick.length) {
                user = findByNick[0];
            } else {
                if (_user.email) {
                    throw new Error('Email não cadastrado');
                }
                if (_user.nick) {
                    throw new Error('Nick não cadastrado');
                }
            }
            let isEqualPassword = await comparePassword(
                _user.password,
                user.password
            );
            if (isEqualPassword) {
                return user;
            } else {
                throw new Error('Senha inválida');
            }
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async getAll() {
        try {
            const users = await db.getAll();
            return users;
        } catch (err: any) {
            throw { err, status: 404 };
        }
    }
}
async function hashPassword(plaintextPassword: string): Promise<string> {
    const hash: string = await bcrypt.hash(plaintextPassword, salt);
    return hash;
}

async function comparePassword(plaintextPassword: string, hash: string) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}
export default UserServ;
