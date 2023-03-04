import { Router } from "express";
import {userCtrl} from "../controller";

const ctrl = new userCtrl();
const route = Router();

route.get('/api/users',ctrl.getUsers)
route.post('/api/users/login',(req,res)=>res.send("login!!"))
route.post('/api/users/register',ctrl.registerUser)
route.get('/api/users/:id',(req,res)=>res.json({ message: `#${req.params.id}` }))

export default route;