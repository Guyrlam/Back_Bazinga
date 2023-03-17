import { Request, Response, Router } from "express";
import formidable from "formidable";
import { postCtrl } from "../controller";
import { auth } from "../middleware/auth";
import s3Client from "../util/s3Client";

const ctrl = new postCtrl();
const route = Router();
route.post("/api/posts", auth, ctrl.create);
route.post("/api/upload", auth, (req: Request, res: Response) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err: any, fields: any, files: any) => {
        const url:any = await s3Client.uploadFile(
            files.filetoupload.newFilename+"."+files.filetoupload.mimetype.split("/")[1],
            files.filetoupload.filepath,
            files.filetoupload.mimetype
        );
        res.json({ url });
    });
});
route.get("/api/posts", auth, ctrl.getAll);
route.get("/api/posts/my", auth, ctrl.getMy);
route.get("/api/posts/users/:nick", auth, ctrl.getToNick);
route.get("/api/posts/:id", auth, ctrl.getId);
route.delete("/api/posts/:id", auth, ctrl.removePost);

route.post("/api/posts/:id/comment", auth, ctrl.addComment);
route.post("/api/posts/:id/like", auth, ctrl.addLike);
route.post("/api/posts/:id/dislike", auth, ctrl.removeLike);

export default route;
