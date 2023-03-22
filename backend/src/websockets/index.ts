import jwt, { JwtPayload } from 'jsonwebtoken';
import { salt } from '../config';
import { IGroup } from '../interface';
import GroupDB from '../models/groups';
import { IMessages } from '../interface/IGroup';
import Redis from 'ioredis';

const db = new GroupDB();
const pubError = new Redis();
const pubMessage = new Redis();
const sub = new Redis();
let count = 0;

const wsAuth = async (token: string, group_id: string) => {
    const decoded = jwt.verify(token as string, salt) as JwtPayload;
    const user_id = decoded._id;
    const group: IGroup[] = await db.getGroupByID(group_id);

    if (!group[0].members.includes(user_id) && group[0].leader_id !== user_id) {
        throw new Error('Não autorizado!');
    }

    return { decoded, group: group[0] };
};

export default (socket: any, io: any) => {
    socket.on(
        'select_group',
        async (data: { group_id: string; token?: string }, callback: any) => {
            try {
                const token =
                    data.token ||
                    socket.handshake.headers.token ||
                    socket.handshake.headers.cookie.slice(6);

                const verify = await wsAuth(token, data.group_id);

                socket.join(data.group_id);

                const chanelMessages = verify.group.messages;

                callback(chanelMessages);
            } catch (error: any) {
                pubError.publish(
                    'error',
                    JSON.stringify({
                        error: error.message,
                    })
                );
            }
        }
    );

    socket.on(
        'message',
        async (data: { group_id: string; message: string; token?: string }) => {
            try {
                const token =
                    data.token ||
                    socket.handshake.headers.token ||
                    socket.handshake.headers.cookie.slice(6);

                const verify = await wsAuth(token, data.group_id);

                const message: IMessages = {
                    username: verify.decoded.nick,
                    text: data.message,
                    created_at: new Date(),
                };

                await db.setMessage(data.group_id, message);

                pubMessage.publish(
                    'message',
                    JSON.stringify({
                        message,
                        group: data.group_id,
                    })
                );

                count = 0;
            } catch (error: any) {
                pubError.publish(
                    'error',
                    JSON.stringify({
                        error: error.message,
                    })
                );
            }
        }
    );

    sub.subscribe('error', 'message', 'feed-update', (err, count) => {
        if (err) {
            console.error('Failed to subscribe: %s', err.message);
        } else {
            console.log(
                `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            );
        }
    });

    sub.on('message', (channel, _data) => {
        try {
            switch (channel) {
                case 'error':
                    const { error } = JSON.parse(_data);
                    io.emit('error', { error });
                    break;

                case 'message':
                    const { message, group } = JSON.parse(_data);
                    count === 0 && io.to(group).emit('message', message);
                    count++;
                    break;

                case 'feed-update':
                    socket.emit('feed-update', JSON.parse(_data));
                    break;
            }
        } catch (error: any) {
            console.log(error.message);
        }
    });
};
