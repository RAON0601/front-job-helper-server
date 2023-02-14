import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { BadRequest } from "../error/BadRequest.js";
import { getYearMonthDate } from "./time.js";

export class ImageUploader {
  constructor() {
    AWS.config.update({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      },
    });

    this.allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp"];
    this.s3 = new AWS.S3();

    this.instance = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: process.env.AWS_S3_BUCKET,
        key: (req, file, callback) => {
          const extension = path.extname(file.originalname);
          if (!allowedExtensions.includes(extension)) {
            return callback(
              new BadRequest(
                "png jpg jpeg bmp 확장자를 가진 파일만 업로드 하실 수 있습니다."
              )
            );
          }

          const [year, month, date] = getYearMonthDate(new Date());
          callback(null, `${year}/${month}/${date}/${file.originalname}`);
        },
        acl: "public-read-write",
      }),
    });
  }
}
