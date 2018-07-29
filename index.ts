import * as AWS from 'aws-sdk';
import * as XmlStream from 'xml-stream';
import * as s3Zip from 's3-zip';


exports.handler = function (event, context) {
  console.log('event', event);


  const region = "eu-west-1";
  const bucket = "maple-backend";
  const folder = "/gallery/original/1";
  //var zipFileName = event.zipFileName;

  const params = {
    Bucket: bucket,
    Prefix: folder
  };

  const s3 = new AWS.S3({ region: region });


  const filesArray = [];
  const files = s3.listObjects(params).createReadStream();
  const xml = new XmlStream(files);
  xml.collect('Key');
  xml.on('endElement: Key', function(item) {
    filesArray.push(item['$text'].substr(folder.length))
  });


 console.log("files: " + filesArray);

  /*

  // Create body stream
  try {

    var body = s3Zip.archive({ region: region, bucket: bucket}, folder, files)
    var zipParams = { params: { Bucket: bucket, Key: folder + zipFileName } }
    var zipFile = new AWS.S3(zipParams)
    zipFile.upload({ Body: body })
    .on('httpUploadProgress', function (evt) { console.log(evt) })
    .send(function (e, r) {
      if (e) {
        var err = 'zipFile.upload error ' + e
        console.log(err)
        context.fail(err)
      }
      console.log(r)
      context.succeed(r)
    })

  } catch (e) {
    var err = 'catched error: ' + e
    console.log(err)
    context.fail(err)
  }

*/
};