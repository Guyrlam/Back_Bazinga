import { Request, Response } from "express";
import { PostValidator } from "../validators/post";
import { IComment,IPost } from "../interface";
import APIResponse from "../util/apiResponse";
import { CustomRequest } from "../interface/IRequest";
import PostServ from "../service/post";
const service = new PostServ();
const apiResponse = new APIResponse()

class PostControl{
    async removePost(req: Request, res: Response) {
        try {
            const token: any = (req as CustomRequest).token;
            const data = await service.removePost(req.params.id,token._id);
            res.json(data);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res,err.err,err.status)
        }
    }
    async removeLike(req: Request, res: Response) {
        try {
            const token: any = (req as CustomRequest).token;
            const data = await service.removeLike(req.params.id,token._id);
            res.json(data);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res,err.err,err.status)
        }
    }
    async addLike(req: Request, res: Response) {
        try {
            const token: any = (req as CustomRequest).token;
            const data = await service.addLike(req.params.id,token._id);
            res.json(data);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res,err.err,err.status)
        }
    }
    async addComment(req: Request, res: Response) {
        const comment: IComment = req.body;
        try {
            //id_creator
            const token: any = (req as CustomRequest).token;
            comment.id_creator = token._id
            //create_at
            const now = new Date();
            comment.create_at = now;

            validatePost(comment);

            const data = await service.addComment(req.params.id,comment);
            res.json(data);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res,err.err,err.status)
        }
    }
    async getId(req: Request, res: Response) {
        const id:string=req.params.id
        try {
            const data = await service.getId(id);
            res.json(data);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }

    async create(req: Request, res: Response) {
        const post: IPost = req.body;
        try {
            const token: any = (req as CustomRequest).token;
            post.id_creator=token._id
            validatePost(post);
            const dt = await service.create(post);
            res.json(dt);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res,err.err,err.status)
        }
    }
    async getAll(req: Request, res: Response) {
        try {
            const dt = await service.getAll(); 
            res.json(dt);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res,err.err,err.status)
        }
    }

}
function validatePost(_data: IPost) {
    const validator = new PostValidator(_data);
    if (validator.errors) {
        console.log(validator.errors);
        throw {err:new Error(validator.errors),status:401};
    }
}

export default PostControl;