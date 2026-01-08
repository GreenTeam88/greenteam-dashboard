import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME || 'greenteam-calculator';

/**
 * Upload a file to S3
 * @param file - The file buffer
 * @param fileName - The file name
 * @param contentType - The MIME type
 * @returns The uploaded file URL and key
 */
export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  const key = `calculator-images/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  const url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'eu-central-1'}.amazonaws.com/${key}`;

  return { url, key };
}
