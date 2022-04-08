const Model = require("../../models/index")
const Validation = require("../validations");
const Auth = require("../../common/authenticate");
const smsService = require("../../services/smsService")
const mailService = require('../../services/EmalService')
const moment = require('moment');
const constants = require("../../common/constants");
const dump = require("../../services/mongoDump")
const QRCode = require('qrcode')
const thumbsupply = require('thumbsupply');
var fs = require('fs');
const aws = require("aws-sdk")
aws.config.update({
    secretAccessKey: 'K+hOs2q5pHGBYMC2TG/+EoO/AIGuRjks5oL3AYaY',
    accessKeyId: 'AKIAWBU5UEEJ4CODPJ6F'
});
var s3 = new aws.S3();

module.exports.uploadFile = async (req, res, next) => {
    try {
      if (!req.file) throw new Error("UPLOADING_ERROR");
      const filename = req.file.filename.replace(/\..+$/, "");
      let normalImage
      let mediumImage
      let midiumFilename = `half-${filename}-${Date.now()}.jpeg`;
      await sharp(req.file.path).jpeg({
          quality: 50
      }).toFile(`public/uploads/customer/${midiumFilename}`)
      let doc = {
          normalImage: `https://api.krugersightings.com:3000//uploads/customer/${filename}`,
          mediumImage: `https://api.krugersightings.com:3000//uploads/customer/${midiumFilename}`,
      }
      const fileContent2 = fs.readFileSync(`public/uploads/customer/${midiumFilename}`);
      const fileContent1 = fs.readFileSync(`public/uploads/customer/${filename}`);
  
      const params = {
          Bucket: 'latestsighting',
          Key: `normal-${req.file.originalname}`,
          Body: fileContent1
      };
      s3.upload(params, async function (err, data) {
          if (err) {
              throw err;
          } else {
              normalImage = data.Location
          }
      });
      const params2 = {
          Bucket: 'latestsighting',
          Key: `small-${req.file.originalname}`,
          Body: fileContent2
      };
      s3.upload(params2, async function (err, data) {
          if (err) {
              throw err;
          } else {
              mediumImage = data.Location
          }
      });
      setTimeout(() => {
        const filePath = mediumImage
        return res.success("Image uploaded successfully", {
          filePath
        });
      }, 2000);
    } catch (error) {
      next(error);
    }
};
module.exports.sendGameCode = async (req, res, next) => {
    try{
      console.log(req.body,"213213")
      const code = req.body.gameCode
      const userId = req.identity;
      const userData = await Model.User.findOne({
        _id: userId,
        isDeleted : false
      })
      if (userData && userData.isDisabled == true) {
        req.body.code = 408
        throw new Error(c.en.USERDISABLE)
      }
      if (userData && userData.isDeleted == true) {
        req.body.code = 408
        throw new Error("No user found")
      }
      if (userData == null) {
        throw new Error(c.en.NOT_EXIST)
      }
      let unique = functions.generateRandomStringAndNumbers(25);
      let url = `https://api.dateandgame.com/another?url=https://www.dateandgame.com/lobby?code=${code}&code=${code}&type=lobby`
      let short = `https://api.dateandgame.com/DXG/${unique}`
      await Model.Url({
        longLink : url,
        shortLink : short,
        code : unique
      }).save()
      return res.status(200).send({
        success: c.en.TRUE,
        data: short
      });
    }catch(error){
      next(error)
    }
};
module.exports.getCode = async (req, res, next) => {
    try {
      console.log(req.params,"213213131232")
      let code = req.params.id
      let short = `https://api.dateandgame.com/DXG/${code}`
      let link = await Model.Url.findOne({
        code : code,
        shortLink : short
      })
      if(link == null){
        throw new Error("Invalid url path")
      }
      return res.redirect(link.longLink)
    }catch(error){
      next(error)
    }
};
module.exports.autoDump = async (req, res, next) => {
    try {
      await dump.dbAutoBackUp()
      console.log("Cron Running every day for backup------------------------------------>");
    } catch (err) {
      console.log(err);
    }
};
module.exports.generateQr = async (req, res, next) => {
    try {
        let text = req.body.text
        let random = functions.generateRandomStringAndNumbers(5)
        let image = ""
        QRCode.toFile(`public/uploads/${random}${text}.png`, text, {
            color: {
                dark: '#0000', // dots
                light: '#000000' // Transparent background
            }
        }, function (err) {
            if (err) throw err
            setTimeout(async () => {
                const fileContent1 = fs.readFileSync(`public/uploads/${random}${text}.png`);
                const params = {
                    Bucket: 'unicornmobility',
                    Key: `${random}${text}.png`,
                    Body: fileContent1
                };
                await s3.upload(params, async function (err, data) {
                    if (err) {
                        throw err;
                    } else {
                        image = data.Location
                        fs.unlink(`public/uploads/${random}${text}.png`, (err) => {
                            if (err) {
                                throw new Error(err)
                            };
                        });
                    }
                });
                console.log('done')
                setTimeout(() => {
                    return res.success(constant.MESSAGE.SUCCESS, {
                        image: `https://unicornmobility.s3.amazonaws.com/${random}${text}.png`
                    })
                }, 1500);
            }, 500);
        })
    } catch (error) {
        next(error)
    }
};
module.exports.getDistance = async (sourceLongitude, sourceLatitude, destinationLongitude, destinationLatitude) => {
    var radlat1 = Math.PI * sourceLatitude / 180
    var radlat2 = Math.PI * destinationLatitude / 180
    var theta = sourceLongitude - destinationLongitude
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515 * 1.609344
    distanceField = dist
    return distanceField
};
module.exports.uploadFile = async (req, res, next) => {
    try {
        const lang = req.headers.language || "en"
        if (!req.file) throw new Error(constants.MESSAGES[lang].UPLOADING_ERROR);
        const filePath = req.file;
        const image = filePath.location;
        return res.success(constants.MESSAGES[lang].IMAGE_UPLOADED, {
            image
        });
    } catch (error) {
        next(error);
    }
};
module.exports.uploadManyFile = async (req, res, next) => {
    try {
        const lang = req.headers.language || "en"
        if (!req.files) throw new Error(constants.MESSAGES[lang].UPLOADING_ERROR);
        const filePath = req.files;
        return res.success(constants.MESSAGES[lang].IMAGE_UPLOADED, {
            filePath
        });
    } catch (error) {
        next(error);
    }
};
module.exports.removeImage = async (req, res, next) => {
    try {
        let name = `${req.body.name}.${req.body.ext}`;
        s3.deleteObject({
            Bucket: "curenew",
            Key: name
        }, function (err, data) {
            if (err) {
                throw new Error("Image not found")
            }
            return res.success("Image removed successfully", data)
        })
    } catch (error) {
        next(error)
    }
};
module.exports.uploadlocal = async (req, res, next) => {
  try {
    const data = req.body.image
    const array = []
    let deleteCount = 0
    let uploadCount = 0
    for (let i = 0; i < data.length; i++) {
      try {
        let image = fs.readFileSync(`public/cureimages/${data[i]}`)
        const params = {
          Bucket: 'curenew',
          Key: data[i],
          Body: image
        };
        s3.deleteObject({
          Bucket: "curenew",
          Key: data[i]
        }, function (err, data) {
          if (err) {
            console.log("Image not found on server")
          } else {
            deleteCount++;
          }
        })
        s3.upload(params, async function (err, data) {
          if (err) {
            throw err;
          } else {
            uploadCount++;
            console.log(`File uploaded successfully. ${data.Location}`);
          }
        });
      } catch (error) {
        array.push(data[i])
      }
    }
    setTimeout(() => {
      return res.success("Success", {
        deleteCount,
        uploadCount,
        array
      })
    }, 5000);
  } catch (error) {
    next(error)
  }
};
module.exports.checkImage = async (req, res, next) => {
  try {
    let images = await Model.Product.find({})
    let array = []
    for (let i = 0; i < images.length; i++) {
      let urll = images[i].thumbnailUrl
      check(urll)
      async function check(url) {
        try {
          let res = await axios.get(url, {
            headers: {
              'content-type': 'application/json'
            },
          })
        } catch (error) {
          array.push({
            thumbnailUrl: images[i].thumbnailUrl,
            thumbnailImageName: images[i].thumbnailImageName
          })
        }

      }
    }
    setTimeout(() => {
      let count = array.length
      return res.success("Success", {
        array,
        count
      });
    }, 6000);
  } catch (error) {
    next(error)
  }
};