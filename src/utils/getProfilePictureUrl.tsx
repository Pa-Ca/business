import defaultUserImage from "../../public/images/user.jpeg"

export default async (businessId: number | null): Promise<string> => {
    const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT;
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
    const name = businessId ? businessId : 'user';
    const url = `https://${endpoint}/${bucket}/business-${name}-profile.jpeg`;
    
    const checkUrl = (await fetch(url)).ok;

    if (!endpoint || !bucket || !checkUrl) return defaultUserImage.src;
    return url;
}