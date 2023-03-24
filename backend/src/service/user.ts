import MiniSearch from 'minisearch';
import { salt } from '../config';
import { ILogin, IUser, IUserUpd } from '../interface';
import UserDB from '../models/user';
import PostDB from '../models/post';
import bcrypt from 'bcrypt';
const db = new UserDB();
const dbPosts = new PostDB();

class UserServ {
    async register(_data: IUser) {
        try {
            const findByEmail = await db.getByEmail(_data.email);
            const findByNick = await db.getByNick(_data.nick);
            if (findByEmail) {
                throw new Error('Este email já esta cadastrado');
            }
            if (findByNick) {
                throw new Error('Este Nick já esta cadastrado');
            }
            _data.password = (await hashPassword(_data.password)) as string;
            const user = await db.register(_data);
            return user;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async update(id: string, _data: IUserUpd) {
        try {
            let findByEmail: any = [];
            let findByNick: any = [];
            if (_data.email) {
                findByEmail = await db.getByEmail(_data.email);
            }
            if (_data.nick) {
                findByNick = await db.getByNick(_data.nick);
            }
            if (findByEmail && findByEmail._id) {
                throw new Error('Este email já esta cadastrado');
            }
            if (findByNick && findByNick._id) {
                throw new Error('Este Nick já esta cadastrado');
            }
            if (_data.password) {
                _data.password = (await hashPassword(_data.password)) as string;
            }
            const user = await db.update(id, _data);
            return user;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async login(_user: ILogin) {
        try {
            let user:any;
            const findByEmail = await db.getByEmail(_user.email || '');
            const findByNick = await db.getByNick(_user.nick || '');
            if (findByEmail) {
                user = findByEmail;
            } else if (findByNick) {
                user = findByNick;
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
            let users = await db.getAll();
            users = users.map(({ _id, name, nick, email }: any) => {
                return { _id, name, nick, email };
            });
            return users;
        } catch (err: any) {
            throw { err, status: 404 };
        }
    }
    async getId(id: string) {
        try {
            const user = await db.getById(id);
            return user;
        } catch (err: any) {
            throw { err, status: 404 };
        }
    }
    async delete(id: string) {
        try {
            await dbPosts.removePostByIdCreator(id);
            const user = await db.removeId(id);
            return user;
        } catch (err: any) {
            throw { err, status: 404 };
        }
    }
    async search(text: string) {
        try {
            const users = await db.getAll();
            let users_find : Array<any> =[];
            let miniSearch = new MiniSearch({
                fields: ['name', 'nick', 'email'],
                storeFields: ['name', 'nick', 'email'],
            });
            miniSearch.addAll(users);
            let results = miniSearch.search(text);
            for (let i = 0; i < results.length; i++) {
                let user = await db.getById(results[i].id)
                users_find[i] = user;
                
            }
            return users_find;
        } catch (err: any) {
            throw { err, status: 404 };
        }
    }
    async suggest(text: string) {
        try {
            const users = await db.getAll();
            let miniSearch = new MiniSearch({
                fields: ['name', 'nick', 'email'],
                storeFields: ['name', 'nick', 'email'],
            });
            miniSearch.addAll(users);
            let results = miniSearch.autoSuggest(text);
            return results;
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
