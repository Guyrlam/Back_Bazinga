import { Router } from "express";
import { uploadCtrl } from "../controller";
import { auth } from "../middleware/auth";
import s3Client from "../util/s3Client";

const ctrl = new uploadCtrl();
const route = Router();
route.post("/api/upload", auth, ctrl.upload);

export default route;
