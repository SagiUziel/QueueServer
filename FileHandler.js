const AWS = require('aws-sdk');

AWS.config.update({ accessKeyId: 'AKIAIVNCCRBU6WKHCHSQ', secretAccessKey: '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' });

this.Run = (socket) => {
    
const options = {
  apiVersion: '2012-10-17',
  params: {
    Bucket: 'queue-storage'
  },
  accessKeyId: 'AKIAIVNCCRBU6WKHCHSQ',
  secretAccessKey: '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',
  signatureVersion: 'v4'
};

socket.on('UploadImage', (base64Image, imageGuid) => {
    try {
        if (base64Image.length > 600000) {
        console.log('File Is Too Big! File Size: ' + base64Data.length);
        return;
        }
        const s3 = new AWS.S3(options);
    
        const base64Data = new Buffer(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        console.log(base64Data.length);
        const type = 'JPEG';
        const imageName = imageGuid + '.' + type;
    
        const params = {
          Bucket: 'queue-storage/User',
          Key: `${imageName}`, // type is not required
          Body: base64Data,
          ACL: 'public-read',
          ContentEncoding: 'base64', // required
          ContentType: `image/${type}` // required. Notice the back ticks
        };
    
        s3.upload(params, (err, data) => {
          if (err) { return console.log(err) }
          console.log('Image successfully uploaded.');
        });
    } catch (e) {
      console.log(e);
    }
  });
};



