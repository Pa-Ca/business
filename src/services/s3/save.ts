import client from "./client"

export default async (file: File | null) => {
    if (!file) return "Error"

    const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
        Key: file.name,
        Body: file,
    };
   
    client.upload(params, (err : String, data : any) => {
        if (err) return err
        else return data.Location
    });
}