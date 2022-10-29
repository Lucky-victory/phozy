import { Router } from "express";
import asyncHandler from "express-async-handler";
import PhotosController from "../controllers/Photos";
import { checkIfAuthenticated, checkIfAuthenticatedOptional } from "../middlewares/Auth";
import ImageUploader from "../utils/Image-uploader";
const router = Router();

router
  .get("/",checkIfAuthenticatedOptional,  PhotosController.getAll)
  .get("/search",checkIfAuthenticatedOptional,  PhotosController.search)
  .get("/:id",checkIfAuthenticatedOptional, PhotosController.getOne)
  .use(checkIfAuthenticated)
  .post(
    "/",
    asyncHandler(ImageUploader.upload),
    asyncHandler(ImageUploader.uploadToCloudinary),
    asyncHandler(PhotosController.addNewPhotos)
  )
  .put("/:id", PhotosController.update)
  .post("/:id/like", PhotosController.like)
  .post("/:id/unlike", PhotosController.unlike)
  .delete("/:id", asyncHandler(PhotosController.delete));
export default router;
