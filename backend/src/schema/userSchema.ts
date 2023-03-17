import { Schema } from 'mongoose';
import { IUser } from '../interface';
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    nick: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: String,
});
export { userSchema };
