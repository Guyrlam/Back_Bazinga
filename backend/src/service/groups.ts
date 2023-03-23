import { IGroup, IUser } from '../interface';
import GroupDB from '../models/groups';
import UserDB from '../models/user';

const db = new GroupDB();
const dbUser = new UserDB();

class GroupServ {
    async register(_data: IGroup) {
        try {
            const findByName = await db.getGroupByName(_data.name);
            if (findByName.length) {
                throw new Error('Este grupo já esta cadastrado');
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
                (el: IGroup) => el.members.includes(_data) || el.leader_id === _data
            );
            const users = await dbUser.getAll();
            const group = myGroups.map((el: any, i: number) => {
                const newMembers = el.members.map((el: string) => {
                    const newEl = users.filter(
                        (element: IUser) => element._id?.toString() === el
                    );
                    return newEl[0];
                });
                const newgroup = {
                    ...el._doc,
                    members: newMembers
                }
                return newgroup
            });
            return group;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async updateGroup(_data: IGroup, _groupID: string, _id: string) {
        try {
            const group: IGroup[] = await db.getGroupByID(_groupID);
            if (group[0].leader_id !== _id) throw new Error('Não Autorizado');

            const updateGroup = await db.updateGroup(_data, _groupID);
            return updateGroup;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
    async deleteGroup(_groupID: string, _id: string) {
        try {
            const group: IGroup[] = await db.getGroupByID(_groupID);
            if (group[0].leader_id !== _id) throw new Error('Não Autorizado');

            const deleteGroup = await db.deleteGroup(_groupID);
            return deleteGroup;
        } catch (err: any) {
            throw { err, status: 400 };
        }
    }
}
export default GroupServ;
