import { Router } from "express";
import { groupCtrl } from "../controller";
import { auth } from "../middleware/auth";

const ctrl = new groupCtrl();
const route = Router();

route.post("/api/groups", auth, ctrl.registerGroup);
route.get("/api/groups", auth, ctrl.getGroups);
route.put("/api/group/:id", auth, ctrl.updateGroup);
route.delete("/api/group/:id", auth, ctrl.deleteGroup);



export default route;
