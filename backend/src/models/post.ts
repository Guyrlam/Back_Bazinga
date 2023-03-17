import { model } from "mongoose";
import { postSchema } from "../schema/postSchema";
import { IComment, IPost } from "../interface";

class PostDB {
    post: any;
    constructor() {
        this.post = model("Post", postSchema);
    }
    async removePost(post_id: string, id_user: string) {
        try {
            const data = await this.post.deleteOne({
                _id: post_id,
                id_creator: id_user,
            });
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async removeLike(post_id: string, id: string) {
        try {
            const data = await this.post.updateOne(
                { _id: post_id },
                { $pull: { likes: id } }
            );
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async addLike(post_id: string, id: string) {
        try {
            const data = await this.post.updateOne(
                { _id: post_id },
                { $push: { likes: id } }
            );
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async addComment(id: string, comment: IComment) {
        try {
            const data = await this.post.updateOne(
                { _id: id },
                { $push: { comments: comment } }
            );
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async findByIdCreator(id: string) {
        try {
            const data = await this.post.findOne({ id_creator: id });
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async findById(id: string) {
        try {
            const data = await this.post.findOne({ _id: id });
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async findIdByLikes(id: string) {
        try {
            const data = await this.post.find({ likes: id });
            return data;
        } catch (err: any) {
            throw err;
        }
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
