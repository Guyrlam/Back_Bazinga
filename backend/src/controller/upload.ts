import { Request, Response } from "express";
import UserServ from "../service/user";
import APIResponse from "../util/apiResponse";
import formidable from "formidable";
import s3Client from "../util/s3Client";
const service = new UserServ();
const apiResponse = new APIResponse();

class UploadControl {
    async upload(req: Request, res: Response) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err: any, fields: any, files: any) => {
            const url:any = await s3Client.uploadFile(
                files.filetoupload.newFilename+"."+files.filetoupload.mimetype.split("/")[1],
                files.filetoupload.filepath,
                files.filetoupload.mimetype
            );
            res.json({ url });
        });
    }
}

export default UploadControl;
