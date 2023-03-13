import { Router } from "express";
import {userCtrl} from "../controller";
import { auth } from "../middleware/auth";

const ctrl = new userCtrl();
const route = Router();

route.get('/api/users', auth, ctrl.getUsers)
route.post('/api/users/login',ctrl.login)
route.post('/api/users/register',ctrl.registerUser)
route.get('/api/users/:id',(req,res)=>res.json({ message: `#${req.params.id}` }))

export default route;