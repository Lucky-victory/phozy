import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";
// import multer, { FileFilterCallback } from "multer";
import { MyUtils } from "my-node-ts-utils";
import formidable, { Files } from "formidable";
import { nextTick } from "process";

export default class ImageUploader {
  static upload(req: Request, res: Response, next: NextFunction) {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) throw err;
      console.log(fields);

      console.log("=======");
      console.log(files.photos);
      req.files = files.photos;
      next();
    });
    // req.f=
    // return multer({ storage: multer.diskStorage({}), fileFilter: fileFilter });
  }
  static async profileImageUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { auth } = req;
    // const result = await cloudinary.uploader.upload(req.file?.path as string, {
    //   public_id: `profile_image_${auth?.user?.id}`,
    //   radius: "max",
    //   width: 500,
    //   height: 500,
    //   crop: "fill",
    //   gravity: "faces",
    // });

    // req.photo_url = result.secure_url;
    next();
  }
  static async uploadToCloudinary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const photo_urls: string[] = [];
    console.log(req.files, "in cloudinary");

    // if (!req.photos?.length) {
    //   res.status(400).json({
    //     message: "No photos to upload",
    //   });
    //   return;
    // }
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.filepath, {
        public_id: `image_${MyUtils.generateID()}`,
      });
      // console.log(result);
      console.log("=====");

      photo_urls.push(result.secure_url);
      console.log(photo_urls);
    }
    req.photo_urls = photo_urls;
    next();
  }
}
// export const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type"));
//   }
// };
