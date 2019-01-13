import * as AWS from 'aws-sdk';
import * as s3Zip from 's3-zip';

export const handler = async function (event, context) {
  try {
    const region = process.env.region;
    const bucket = process.env.bucket;

    const srcFolderName = process.env.srcFolderName;
    const destFolderName = process.env.destFolderName;
    const destFileName = process.env.fileName;

    const srcFolderPath = event.srcFolderPath;

    const s3 = new AWS.S3({region: region});

    const files = await s3.listObjects({Bucket: bucket, Prefix: srcFolderPath}).promise();
    const fileNames = files.Contents
        .map(item => item.Key.split('/').pop())
        .filter(name => !!name);

    const stream = s3Zip.archive({region: region, bucket: bucket}, srcFolderPath, fileNames);

    const destKey = srcFolderPath.replace(srcFolderName, destFolderName) + destFileName;

    await s3.upload({
      Bucket: bucket,
      Key: destKey,
      Body: stream,
    }).promise();

  } catch (e) {
    const err = 'catched error: ' + e;
    console.log(err);
    context.fail(err);
  }
};
