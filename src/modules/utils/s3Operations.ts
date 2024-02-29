import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../../config/config';

const s3Client = new S3Client({
  region: config.aws.userRegion,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const uploadToBucket = async (params: any) => await s3Client.send(new PutObjectCommand(params));

export const deleteFromBucket = async (params: any) => await s3Client.send(new DeleteObjectCommand(params));
