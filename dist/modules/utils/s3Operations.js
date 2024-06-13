"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteObjectsFromBucket = exports.deleteObjectFromBucket = exports.uploadObjectToBucket = exports.getObjectFromBucket = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../../config/config"));
const s3Client = new client_s3_1.S3Client({
    region: config_1.default.aws.userRegion,
    credentials: {
        accessKeyId: config_1.default.aws.accessKeyId,
        secretAccessKey: config_1.default.aws.secretAccessKey,
    },
});
const getObjectFromBucket = async (params) => s3Client.send(new client_s3_1.GetObjectCommand(params));
exports.getObjectFromBucket = getObjectFromBucket;
const uploadObjectToBucket = async (params) => s3Client.send(new client_s3_1.PutObjectCommand(params));
exports.uploadObjectToBucket = uploadObjectToBucket;
const deleteObjectFromBucket = async (params) => s3Client.send(new client_s3_1.DeleteObjectCommand(params));
exports.deleteObjectFromBucket = deleteObjectFromBucket;
const deleteObjectsFromBucket = async (params) => s3Client.send(new client_s3_1.DeleteObjectsCommand(params));
exports.deleteObjectsFromBucket = deleteObjectsFromBucket;
//# sourceMappingURL=s3Operations.js.map