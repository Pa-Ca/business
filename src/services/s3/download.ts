export default function Download (bucketName : String, filePath : String) {
    const params = {
        Bucket: bucketName,
        Key: filePath,
    };
    
    s3.getObject(params, (err : String, data : any) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`File downloaded successfully. ${data.Body.toString()}`);
        }
    });
}
