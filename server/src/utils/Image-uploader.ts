import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";

import formidable from "formidable";
import { zipWith } from "lodash/fp";
import { Utils } from ".";

export default class ImageUploader {
  static upload(req: Request, res: Response, next: NextFunction) {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) throw err;

      req.fields = JSON.parse(fields.all as string);
      req.files = files.photos as formidable.File[];
      if (!Array.isArray(req.files)) req.files = [req.files];
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

    if (!req.files?.length) {
      res.status(400).json({
        message: "No photos to upload",
      });
      return;
    }
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.filepath, {
        public_id: `image_${Utils.generateID()}`,
        folder: "phozy",
      });

      photo_urls.push(result.secure_url);
    }
    const { fields } = req;

    req.photo_urls = zipWith(
      (url, field: object) => ({ url, ...field }),
      photo_urls,
      fields
    );
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
