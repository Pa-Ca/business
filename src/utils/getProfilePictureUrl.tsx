import defaultUserImage from "../../public/images/user.jpeg";

export default async (businessId: number | null): Promise<string> => {
  if (!businessId) return defaultUserImage.src;

  const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT;
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
  const url = `https://${endpoint}/${bucket}/business-${businessId}-profile.jpeg`;

  try {
    const checkUrl = (await fetch(url)).ok;

    if (!endpoint || !bucket || !checkUrl) return defaultUserImage.src;
    return url;
  } catch (e) {
    return defaultUserImage.src;
  }
};
