import httpStatus from 'http-status';
import { randomUUID } from 'crypto';
import { deleteObjectFromBucket, getObjectFromBucket, uploadObjectToBucket } from './s3Operations';
import config from '../../config/config';
import { ApiError } from '../errors';
import { ObjectIdentifierList } from './common.interfaces';

export const isS3Object = (url: string): boolean => Boolean(url && url.startsWith(config.aws.bucketBaseUrl));

export const getFileKey = (url: string): string => {
  if (!config.aws.bucketBaseUrl) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Please setup aws bucket.');
  return url.substring(config.aws.bucketBaseUrl.length);
};
export const getFileUploadParams = (base64String: string, folderName: string | undefined) => {
  const format = base64String.substring(base64String.indexOf('data:') + 5, base64String.indexOf(';base64'));
  const fileExtension = format.split('/')[1];

  const buffer = Buffer.from(base64String.replace(/^data:\w+\/\w+;base64,/, ''), 'base64');

  const params = {
    Bucket: config.aws.bucket,
    Key: `${folderName}/${Date.now().toString()}-${randomUUID()}.${fileExtension}`,
    Body: buffer,
    ContentType: format,
    ACL: 'public-read',
  };

  return params;
};

export const deleteFileWithoutParams = async (file: string): Promise<void> => {
  const deleteFileParams = {
    Bucket: config.aws.bucket,
    Key: getFileKey(file),
  };
  await deleteObjectFromBucket(deleteFileParams);
};

export const getMultipleFileDeleteParams = (array: object[]) => {
  const multipleObjectDeleteKeys: ObjectIdentifierList = [];
  array.forEach((fileObject: any) => {
    if (isS3Object(fileObject)) {
      multipleObjectDeleteKeys.push({
        Key: getFileKey(fileObject),
      });
    }
  });

  return {
    Bucket: config.aws.bucket,
    Delete: {
      Objects: multipleObjectDeleteKeys,
      Quiet: true,
    },
  };
};

export const uploadFileToS3 = async (
  fileUrl: string,
  oldFileUrl: string | null,
  destinationFolder: string = config.aws.unlabeledFolder
): Promise<string> => {
  const params = getFileUploadParams(fileUrl, destinationFolder);
  await uploadObjectToBucket(params);
  if (oldFileUrl) {
    await deleteFileWithoutParams(oldFileUrl);
  }
  return config.aws.bucketBaseUrl + params.Key;
};

export const gets3FileUrl = async (
  oldFileUrl: string | null,
  newFileUrl: string | null,
  destinationFolder: string = config.aws.unlabeledFolder
): Promise<string | null> => {
  if (newFileUrl && isS3Object(newFileUrl)) {
    try {
      await getObjectFromBucket({ Bucket: config.aws.bucket, Key: getFileKey(newFileUrl) });
      return newFileUrl;
    } catch (error) {
      return null;
    }
  }

  if (!newFileUrl) {
    if (oldFileUrl) {
      await deleteFileWithoutParams(oldFileUrl);
    }
    return null;
  }

  if (newFileUrl === oldFileUrl) {
    try {
      // await getObjectFromBucket({ Bucket: config.aws.bucket, Key: getFileKey(newFileUrl) });
      return oldFileUrl;
    } catch (error) {
      return null;
    }
  }

  if (newFileUrl.startsWith('data:')) {
    return uploadFileToS3(newFileUrl, oldFileUrl, destinationFolder);
  }

  return oldFileUrl;
};
