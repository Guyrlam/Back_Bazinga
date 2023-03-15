import { Request, Response } from "express";
import GroupServ from "../service/groups";
import { IGroup } from "../interface";
import APIResponse from "../util/apiResponse";
import { CustomRequest } from "../interface/IRequest";
const service = new GroupServ();
const apiResponse = new APIResponse();

class GroupControl {
    async registerGroup(req: Request, res: Response) {
        try {
            const token = (req as CustomRequest).token;
            const groupData: IGroup = {
                name: req.body.name,
                leader_id: (token as any)._id,
                members: req.body.members,
                messages: [],
                created_at: new Date(),
                image_path: req.body.image_path || "",
                deleted_at: null,
            };
            const dt = await service.register(groupData);
            res.json(dt);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }
    async getGroups(req: Request, res: Response) {
        try {
            const token = (req as CustomRequest).token;
            const userID = (token as any)._id;
            const dt = await service.myGroups(userID);
            res.json(dt);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }
    async updateGroup(req: Request, res: Response) {
        const group_id = req.params.id;
        try {
            const token = (req as CustomRequest).token;

            const groupData: IGroup = {
                name: req.body.name,
                leader_id: (token as any)._id,
                members: req.body.members,
                updated_at: new Date(),
                image_path: req.body.image_path || "",
            };

            const userID = (token as any)._id;
            const dt = await service.updateGroup(groupData, group_id, userID);
            res.json(dt);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }
    async deleteGroup(req: Request, res: Response) {
        const group_id = req.params.id;
        try {
            const token = (req as CustomRequest).token;
            const userID = (token as any)._id;

            const dt = await service.deleteGroup(group_id, userID);

            res.json(dt);
        } catch (err: any) {
            console.log(err);
            apiResponse.error(res, err.err, err.status);
        }
    }
}

export default GroupControl;
