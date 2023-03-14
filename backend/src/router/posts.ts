import { Router } from "express";
import {postCtrl} from "../controller";
import { auth } from "../middleware/auth";
const ctrl = new postCtrl();
const route = Router();
route.post('/api/posts', auth, ctrl.create);
route.get('/api/posts', auth, ctrl.getAll);
route.get('/api/posts/my', auth, ctrl.getMy);
route.get('/api/posts/users/:nick', auth, ctrl.getToNick);
route.get('/api/posts/:id', auth, ctrl.getId);
route.delete('/api/posts/:id', auth, ctrl.removePost)

route.post('/api/posts/:id/comment', auth, ctrl.addComment);
route.post('/api/posts/:id/like', auth, ctrl.addLike);
route.post('/api/posts/:id/dislike', auth, ctrl.removeLike);

export default route;