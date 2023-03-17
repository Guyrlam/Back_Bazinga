interface IMessages {
    username: string;
    text: string;
    created_at: Date;
}

interface IGroup {
    _id?: string;
    name: string;
    leader_id?: string;
    members: string[];
    messages?: IMessages[];
    image_path: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}

export { IGroup, IMessages };
