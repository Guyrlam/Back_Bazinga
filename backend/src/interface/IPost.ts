import { Schema } from 'mongoose';

export interface IComment {
    id_creator: string;
    content: string;
    create_at: Date;
}

export interface IPost {
    img?: string;
    id_creator: string | Schema.Types.ObjectId;
    content: string;
    comments?: Array<IComment>;
    likes?: Array<string>;
    create_at?: Date;
}
