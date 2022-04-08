
const multer = require('multer')
const path = require('path')
const fs = require('fs');

const multerS3 = require('multer-s3');
const aws = require("aws-sdk")

aws.config.update({
    secretAccessKey: 'Pgv7PuD91kX3KGlUrV5WC2Ck9cHvOWBobrR5EtQC',
    accessKeyId: 'AKIAWHH3GLAIIHELFP6S'
});
var s3 = new aws.S3();
var uploads = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'curenew',
        ACL : "public-read",
        key: function (req, files, cb) {
            if(files.fieldname == "files"){
                console.log(files,"upload")
                let fileName = files.originalname
                s3.deleteObject({
                    Bucket: "curenew",
                    Key: fileName
                }, function (err, data) {
                    if (err) {
                        return cb(new Error('Image not found'));
                    }
                    console.log("success")
                })
                setTimeout(() => {
                    // cb(null, true);
                    cb(null, files.originalname); //use Date.now() for unique file keys
                }, 200);
              }else {
                cb(null, false);
                return cb(new Error('Invalid File Format: Only .png, .jpg and .jpeg format allowed!'));
              }
        }
    })
});

module.exports = {
    uploads : uploads
}