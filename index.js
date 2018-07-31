"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const s3Zip = require("s3-zip");
exports.handler = function (event, context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const region = process.env.region;
            const bucket = process.env.bucket;
            const srcFolderName = process.env.srcFolderName;
            const destFolderName = process.env.destFolderName;
            const srcFolderPath = event.srcFolderPath;
            const s3 = new AWS.S3({ region: region });
            const files = yield s3.listObjects({ Bucket: bucket, Prefix: srcFolderPath }).promise();
            const fileNames = files.Contents
                .map(item => item.Key.split('/').pop())
                .filter(name => !!name);
            const stream = s3Zip.archive({ region: region, bucket: bucket }, srcFolderPath, fileNames);
            const DestKey = srcFolderPath.replace(srcFolderName, destFolderName) + "images.zip";
            yield s3.upload({
                Bucket: bucket,
                Key: DestKey,
                Body: stream,
            }).promise();
        }
        catch (e) {
            const err = 'catched error: ' + e;
            console.log(err);
            context.fail(err);
        }
    });
};
//# sourceMappingURL=index.js.map