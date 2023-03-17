import jwt, { JwtPayload } from "jsonwebtoken";
import { salt } from "../config";
import { IGroup } from "../interface";
import GroupDB from "../models/groups";
import { IMessages } from "../interface/IGroup";
import Redis from "ioredis";

const db = new GroupDB();
const pubError = new Redis();
const pubMessage = new Redis();
const sub = new Redis();

export default (socket: any, io: any) => {
    socket.on(
        "select_group",
        async (data: { group_id: string }, callback: any) => {
            try {
                const token = socket.handshake.headers.cookie.slice(6);
                const decoded = jwt.verify(token as string, salt) as JwtPayload;
                const user_id = decoded._id;
                const group: IGroup[] = await db.getGroupByID(data.group_id);
                if (
                    !group[0].members.includes(user_id) &&
                    group[0].leader_id !== user_id
                ) {
                    throw new Error("Não autorizado!");
                }

                socket.join(data.group_id);

                const chanelMessages = group[0].messages;

                callback(chanelMessages);
            } catch (error: any) {
                pubError.publish(
                    "error",
                    JSON.stringify({
                        error: error.message,
                    })
                );
            }
        }
    );

    socket.on(
        "message",
        async (data: { group_id: string; message: string }) => {
            try {
                const token = socket.handshake.headers.cookie.slice(6);
                const decoded = jwt.verify(token as string, salt) as JwtPayload;
                const user_id = decoded._id;
                const group: IGroup[] = await db.getGroupByID(data.group_id);
                if (
                    !group[0].members.includes(user_id) &&
                    group[0].leader_id !== user_id
                ) {
                    throw new Error("Não autorizado!");
                }

                const message: IMessages = {
                    username: decoded.nick,
                    text: data.message,
                    created_at: new Date(),
                };

                await db.setMessage(data.group_id, message);

                pubMessage.publish(
                    "message",
                    JSON.stringify({
                        message,
                        group: data.group_id,
                    })
                );
            } catch (error: any) {
                pubError.publish(
                    "error",
                    JSON.stringify({
                        error: error.message,
                    })
                );
            }
        }
    );

    sub.subscribe("error", "message", "feed-update", (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            );
        }
    });

    sub.on("message", (channel, _data) => {
        try {
            if (channel === "error") {
                const { error } = JSON.parse(_data);
                io.emit("error", { error });
            }
            if (channel === "message") {
                const { message, group } = JSON.parse(_data);
                io.to(group).emit("message", message);
            }
            if (channel === "feed-update") {
                socket.emit("feed-update", JSON.parse(_data));
            }
        } catch (error: any) {
            console.log(error.message);
        }
    });
};
