import { Schema } from 'mongoose';
import { IPost } from '../interface';
const postSchema = new Schema<IPost>({
  id_creator: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  content: { type: String, required: true},
  create_at: { type: Date, required: true, default: Date.now},
  comments: [{
    id_creator: {type: Schema.Types.ObjectId, ref: 'users'},
    content: { type: String},
    create_at: { type: Date, default: Date.now}
  }],
  likes:[{ type: Schema.Types.ObjectId, ref: 'users' }]
});
export {postSchema}