import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

/** Default presigned URL expiry in seconds (60s for security) */
const PRESIGNED_URL_EXPIRY = 60;

/**
 * Upload a file buffer to S3.
 *
 * The caller is responsible for constructing the S3 key
 * (path) — this keeps the storage layer domain-agnostic.
 */
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
  return key;
}

/**
 * Generate a short-lived presigned download URL for any S3 object.
 *
 * @param key       - The S3 object key
 * @param filename  - Optional download filename shown to the browser
 * @param expiresIn - URL lifetime in seconds (default: 60)
 */
export async function getPresignedUrl(
  key: string,
  filename?: string,
  expiresIn: number = PRESIGNED_URL_EXPIRY,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ...(filename
      ? { ResponseContentDisposition: `attachment; filename="${filename}"` }
      : {}),
  });
  return await getSignedUrl(s3Client, command, { expiresIn });
}