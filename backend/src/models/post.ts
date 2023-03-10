import { model } from 'mongoose'
import { postSchema } from '../schema/postSchema';
import { IPost } from '../interface';

class PostDB{
    post: any;
    constructor() {
        this.post = model("Post", postSchema);
    }
    async findAll() {
        try {
            const data = await this.post.find({});
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async create(_data: IPost) {
        try {
            const data = await this.post.create(_data);
            return data;
        } catch (err: any) {
            throw err;
        }
    }
}

export default PostDB;