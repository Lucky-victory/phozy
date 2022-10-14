import { checkIfAuthenticated } from "./../middlewares/Auth";
import { Router } from "express";
const router = Router();
import ImageUploader from "../utils/Image-uploader";
import PhotosController from "../controllers/Photos";
import asyncHandler from "express-async-handler";

router
  .get("/", PhotosController.getAll)
  .get("/:id", PhotosController.getOne)
  .use(checkIfAuthenticated)
  .post(
    "/",

    asyncHandler(ImageUploader.upload),
    asyncHandler(ImageUploader.uploadToCloudinary),
    asyncHandler(PhotosController.addNewPhotos)
  )
  .put("/:id", PhotosController.updatePhoto)
  .put("/:id/like", PhotosController.likePhoto)
  .put("/:id/unlike", PhotosController.unlikePhoto)
  .delete(
    "/:id",

    asyncHandler(PhotosController.deletePhoto)
  );
export default router;
