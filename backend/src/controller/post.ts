import { Request, Response } from "express";
import { PostValidator } from "../validators/post";
import { ILogin, IPost, IUser } from "../interface";
import APIResponse from "../util/apiResponse";
import { CustomRequest } from "../interface/IRequest";
import PostServ from "../service/post";
const service = new PostServ();
const apiResponse = new APIResponse()

class PostControl{

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