import { model } from "mongoose";
import { groupSchema } from "../schema/groupSchema";
import { IGroup } from "../interface";

class GroupDB {
    group: any;
    constructor() {
        this.group = model("Group", groupSchema);
    }
    async registerGroup(_data: IGroup) {
        try {
            const data = await this.group.create(_data);
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async getGroupByName(_name: string) {
        try {
            const data = await this.group.find({ name: _name, deleted_at: null });
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async getGroupByID(id: string) {
        try {
            const data = await this.group.find({ _id: id, deleted_at: null });
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async getGroups() {
        try {
            const data = await this.group.find({ deleted_at: null });
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async updateGroup(_data: IGroup, _groupID: string) {
        try {
            const data = await this.group.updateOne(
                { _id: _groupID, deleted_at: null },
                {
                    $set: {
                        name: _data.name,
                        members: _data.members,
                        updated_at: _data.updated_at,
                        image_path: _data.image_path,
                    },
                }
            );
            return data;
        } catch (err: any) {
            throw err;
        }
    }
    async deleteGroup(_groupID: string) {
        try {
            const data = await this.group.updateOne(
                { _id: _groupID, deleted_at: null },
                {
                    $set: {
                        deleted_at: new Date()
                    },
                }
            );
            return data;
        } catch (err: any) {
            throw err;
        }
    }
}

export default GroupDB;
