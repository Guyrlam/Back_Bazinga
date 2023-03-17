import dotenv from 'dotenv';
import { env } from 'process';
import AWS from 'aws-sdk';
import fs from 'fs';
 
async function uploadFile(fileName:any, filePath:any, mimeType?:any) {
    const s3 = new AWS.S3({ apiVersion: '2023-03-01', region: env.AWS_REGION });
    const fileContent = fs.readFileSync(filePath);
 
    const params:any = {
        Bucket: env.AWS_S3_BUCKET,
        ACL: 'public-read',
        Key: fileName,
        Body: fileContent,
        ContentType: mimeType
    };
 
    const data = await s3.upload(params).promise();
    return data.Location;
}
 
async function deleteFile(filter:any) {
    const s3 = new AWS.S3({ apiVersion: '2023-03-01', region: env.AWS_REGION });
    const params:any = {
        Bucket: env.AWS_S3_BUCKET,
        Prefix: decodeURIComponent(filter)
    };
 
    const result:any = await s3.deleteObject(params).promise();
    return result;
}
 
export default { uploadFile, deleteFile }