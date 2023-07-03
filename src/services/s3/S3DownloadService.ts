import client from "./S3ClientService";
import { GetObjectOutput, GetObjectRequest } from "aws-sdk/clients/s3";


export default async (filePath: string | null) => {

    if (!process.env.NEXT_PUBLIC_S3_BUCKET) {
        return { error: new Error("Bucket name is not given"), isError: true };
    }

    if (!filePath) {
        return { error: new Error("File path is not given"), isError: true };
    }

    // Request object
    const params: GetObjectRequest = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
        Key: filePath,
    };

    try {
        // Try download
        const data: GetObjectOutput = await client.getObject(params).promise();

        let file: File;

        // Check types
        if (data.Body instanceof Buffer || data.Body instanceof Uint8Array ||
            data.Body instanceof Blob || typeof data.Body === "string") {
            file = new File([data.Body], "image.jpg", { type: "image/jpeg" });
        } else {
            return { error: new Error("Unsupported data type"), isError: true };
        }
        return { data: file, isError: false };

    } catch (e) {
        return { error: e as Error, isError: true };
    }
};