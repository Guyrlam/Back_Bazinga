import { Schema } from "mongoose";
import { IGroup } from "../interface";
const groupSchema = new Schema<IGroup>({
    name: { type: String, required: true, unique: true },
    leader_id: { type: String, required: true },
    members: { type: Array(String), required: true },
    messages: { type: Array },
    image_path: { type: String },
    created_at: { type: Date, required: true },
    updated_at: { type: Date },
    deleted_at: { type: Date }
});

export { groupSchema };
