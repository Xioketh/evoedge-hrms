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

export async function uploadOfferPdfToS3(buffer: Buffer, offerId: string): Promise<string> {
  const datePath = new Date().toISOString().slice(0, 7); 
  const s3Key = `offers/${datePath}/offer-${offerId}.pdf`;

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: buffer,
    ContentType: "application/pdf",
  }));
  
  return s3Key;
}

export async function getPresignedPdfUrl(s3Key: string, filename?: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    ...(filename ? { ResponseContentDisposition: `attachment; filename="${filename}"` } : {}),
  });
  
  // URL expires in 60 seconds for maximum security
  return await getSignedUrl(s3Client, command, { expiresIn: 60 }); 
}