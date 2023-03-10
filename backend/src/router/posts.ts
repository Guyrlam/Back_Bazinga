import { Router } from "express";
import {postCtrl} from "../controller";
import { auth } from "../middleware/auth";

const ctrl = new postCtrl();
const route = Router();

route.post('/api/posts', auth, ctrl.create);
route.get('/api/posts', auth, ctrl.getAll);

export default route;