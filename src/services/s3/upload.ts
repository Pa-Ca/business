import client from "./client";
import { PutObjectRequest } from "aws-sdk/clients/s3";

export default async (file: File | null, fileName: string) => {
  if (!process.env.NEXT_PUBLIC_S3_BUCKET) {
    return { error: new Error("Bucket name is not given"), isError: true };
  }

  if (!file) {
    return { error: new Error("File path is not given"), isError: true };
  }

  if (!fileName) {
    return { error: new Error("File name is not given"), isError: true };
  }

  const params: PutObjectRequest = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
    Key: fileName,
    Body: file,
    ACL: "public-read",
  };

  try {
    const data = await client.putObject(params).promise();
    return { data: data.Location, isError: false };
  } catch (e) {
    return { error: e as Error, isError: true };
  }
};