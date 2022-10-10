import { v4 as uuidV4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";

export default class ImageUploader {
  static upload() {
    return multer({ storage: multer.diskStorage({}), fileFilter: fileFilter });
  }
  static async profileImageUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { auth } = req;
    const result = await cloudinary.uploader.upload(req.file?.path as string, {
      public_id: `profile_image_${auth?.user?.id}`,
      radius: "max",
      width: 500,
      height: 500,
      crop: "fill",
      gravity: "faces",
    });

    req.photo_url = result.secure_url;
    next();
  }
  static async albumImageUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const photo_urls: string[] = [];
    if (!req.files?.length) {
      res.status(400).json({
        message: "No files were found",
      });
      return;
    }
    for (const file of req.files as Express.Multer.File[]) {
      const result = await cloudinary.uploader.upload(file.path, {
        public_id: `album_image_${uuidV4()}`,

        width: 1000,
        height: 1000,
        crop: "fill",
        gravity: "faces",
      });
      photo_urls.push(result.secure_url);
    }
    req.photo_urls = photo_urls;
    next();
  }
}
export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};
