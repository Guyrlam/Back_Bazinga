import { IComment, ILogin, IPost, IUser } from '../interface';
import PostDB from '../models/post';
import UserDB from '../models/user';
const db = new PostDB();
const dbUser = new UserDB();

class PostServ {
    async removePost(post_id: string, id: string) {
        try {
            const post = await db.removePost(post_id, id);
            return post;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async removeLike(post_id: string, id: string) {
        try {
            await db.removeLike(post_id, id);
            const post = await db.findById(post_id);
            return post;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async addLike(post_id: string, id: string) {
        try {
            let existPost = await db.findIdByLikes(post_id);
            if (!existPost.length) throw new Error('Já existe seu like.');
            await db.addLike(post_id, id);
            const post = await db.findById(post_id);
            return post;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async addComment(id: string, comment: IComment) {
        try {
            await db.addComment(id, comment);
            const post = await db.findById(id);
            return post;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async getId(id: string) {
        try {
            const posts = await db.findById(id);
            return posts;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async getToNick(nick: string) {
        try {
            const user = await dbUser.getByNick(nick);
            const posts = await db.findByIdCreator(user._id);
            return posts;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async getMy(id: string) {
        try {
            const posts = await db.findByIdCreator(id);
            return posts;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async getAll() {
        try {
            const posts = await db.findAll();
            return posts;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async create(_data: IPost) {
        try {
            const post = await db.create(_data);
            return post;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
}
export default PostServ;
