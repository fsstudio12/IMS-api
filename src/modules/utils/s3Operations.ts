import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../../config/config';

const s3Client = new S3Client({
  region: config.aws.userRegion,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const getObjectFromBucket = async (params: any) => s3Client.send(new GetObjectCommand(params));

export const uploadObjectToBucket = async (params: any) => s3Client.send(new PutObjectCommand(params));

export const deleteObjectFromBucket = async (params: any) => s3Client.send(new DeleteObjectCommand(params));

export const deleteObjectsFromBucket = async (params: any) => s3Client.send(new DeleteObjectsCommand(params));
