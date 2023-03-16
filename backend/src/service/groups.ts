import { Console } from "console";
import { IGroup } from "../interface";
import GroupDB from "../models/groups";
const db = new GroupDB();

class GroupServ {
    async register(_data: IGroup) {
        try {
            const findByName = await db.getGroupByName(_data.name);
            if (findByName.length) {
                throw new Error("Este grupo já está cadastrado!");
            }
            const group = await db.registerGroup(_data);
            return group;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async myGroups(_data: string) {
        try {
            const groups = await db.getGroups();
            const myGroups = groups.filter(
                (el: IGroup) =>
                    el.members.includes(_data) || el.leader_id === _data
            );
            return myGroups;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async updateGroup(_data: IGroup, _groupID: string, _id: string) {
        try {
            const group: IGroup[] = await db.getGroupByID(_groupID);
            if (group[0].leader_id !== _id) throw new Error("Não Autorizado!");

            const updateGroup = await db.updateGroup(_data, _groupID);
            return updateGroup;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async deleteGroup(_groupID: string, _id: string) {
        try {
            const group: IGroup[] = await db.getGroupByID(_groupID);
            if (group[0].leader_id !== _id) throw new Error("Não Autorizado!");

            const deleteGroup = await db.deleteGroup(_groupID);
            return deleteGroup;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
}
export default GroupServ;
