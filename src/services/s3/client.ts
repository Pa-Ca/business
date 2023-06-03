const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT,
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});

export default s3;