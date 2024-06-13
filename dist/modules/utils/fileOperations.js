"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gets3FileUrl = exports.uploadFileToS3 = exports.getMultipleFileDeleteParams = exports.deleteFileWithoutParams = exports.getFileUploadParams = exports.getFileKey = exports.isS3Object = void 0;
const http_status_1 = __importDefault(require("http-status"));
const crypto_1 = require("crypto");
const s3Operations_1 = require("./s3Operations");
const config_1 = __importDefault(require("../../config/config"));
const errors_1 = require("../errors");
const isS3Object = (url) => Boolean(url && url.startsWith(config_1.default.aws.bucketBaseUrl));
exports.isS3Object = isS3Object;
const getFileKey = (url) => {
    if (!config_1.default.aws.bucketBaseUrl)
        throw new errors_1.ApiError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Please setup aws bucket.');
    return url.substring(config_1.default.aws.bucketBaseUrl.length);
};
exports.getFileKey = getFileKey;
const getFileUploadParams = (base64String, folderName) => {
    const format = base64String.substring(base64String.indexOf('data:') + 5, base64String.indexOf(';base64'));
    const fileExtension = format.split('/')[1];
    const buffer = Buffer.from(base64String.replace(/^data:\w+\/\w+;base64,/, ''), 'base64');
    const params = {
        Bucket: config_1.default.aws.bucket,
        Key: `${folderName}/${Date.now().toString()}-${(0, crypto_1.randomUUID)()}.${fileExtension}`,
        Body: buffer,
        ContentType: format,
        ACL: 'public-read',
    };
    return params;
};
exports.getFileUploadParams = getFileUploadParams;
const deleteFileWithoutParams = async (file) => {
    const deleteFileParams = {
        Bucket: config_1.default.aws.bucket,
        Key: (0, exports.getFileKey)(file),
    };
    await (0, s3Operations_1.deleteObjectFromBucket)(deleteFileParams);
};
exports.deleteFileWithoutParams = deleteFileWithoutParams;
const getMultipleFileDeleteParams = (array) => {
    const multipleObjectDeleteKeys = [];
    array.forEach((fileObject) => {
        if ((0, exports.isS3Object)(fileObject)) {
            multipleObjectDeleteKeys.push({
                Key: (0, exports.getFileKey)(fileObject),
            });
        }
    });
    return {
        Bucket: config_1.default.aws.bucket,
        Delete: {
            Objects: multipleObjectDeleteKeys,
            Quiet: true,
        },
    };
};
exports.getMultipleFileDeleteParams = getMultipleFileDeleteParams;
const uploadFileToS3 = async (fileUrl, oldFileUrl, destinationFolder = config_1.default.aws.unlabeledFolder) => {
    const params = (0, exports.getFileUploadParams)(fileUrl, destinationFolder);
    await (0, s3Operations_1.uploadObjectToBucket)(params);
    if (oldFileUrl) {
        await (0, exports.deleteFileWithoutParams)(oldFileUrl);
    }
    return config_1.default.aws.bucketBaseUrl + params.Key;
};
exports.uploadFileToS3 = uploadFileToS3;
const gets3FileUrl = async (oldFileUrl, newFileUrl, destinationFolder = config_1.default.aws.unlabeledFolder) => {
    if (newFileUrl && (0, exports.isS3Object)(newFileUrl)) {
        try {
            await (0, s3Operations_1.getObjectFromBucket)({ Bucket: config_1.default.aws.bucket, Key: (0, exports.getFileKey)(newFileUrl) });
            return newFileUrl;
        }
        catch (error) {
            return null;
        }
    }
    if (!newFileUrl) {
        if (oldFileUrl) {
            await (0, exports.deleteFileWithoutParams)(oldFileUrl);
        }
        return null;
    }
    if (newFileUrl === oldFileUrl) {
        try {
            // await getObjectFromBucket({ Bucket: config.aws.bucket, Key: getFileKey(newFileUrl) });
            return oldFileUrl;
        }
        catch (error) {
            return null;
        }
    }
    if (newFileUrl.startsWith('data:')) {
        return (0, exports.uploadFileToS3)(newFileUrl, oldFileUrl, destinationFolder);
    }
    return oldFileUrl;
};
exports.gets3FileUrl = gets3FileUrl;
//# sourceMappingURL=fileOperations.js.map