const multerS3 = require('multer-s3');
const multer = require("multer");
const aws = require("aws-sdk")

aws.config.update({
    secretAccessKey: 'r2rxKNzUNBzn9KH9XoHtEDcEVAFH13moV+3LjpjX',
    accessKeyId: 'AKIAWBU5UEEJ45RYT3MQ'
});
var s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'preppablo',
        ACL : "public-read",
        key: function (req, file, cb) {
            console.log("File upload ------>",file);
            cb(null, (Date.now() + file.originalname)); //use Date.now() for unique file keys
        },
        resize: {
            width: 100,
            height: 100
        }
    })
});

module.exports = {
    upload : upload
}