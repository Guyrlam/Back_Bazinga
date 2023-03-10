import { salt } from "../config";
import { ILogin, IPost, IUser } from "../interface";
import PostDB from "../models/post";
import bcrypt from 'bcrypt';
const db = new PostDB();

class PostServ{
    async getAll() {
        try {
            const posts = await db.findAll();
            return posts;
        } catch (err: any) {
            throw {err,status:400};
        }
    }
    async create(_data: IPost) {
        try {
            const post = await db.create(_data);
            return post;
        } catch (err: any) {
            throw {err,status:400};
        }
    }
}
export default PostServ;