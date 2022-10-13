import { checkIfAuthenticated } from "./../middlewares/Auth";
import { Router } from "express";
const router = Router();
import ImageUploader from "../utils/Image-uploader";
import PhotosController from "../controllers/Photos";
import asyncHandler from "express-async-handler";

// when a user is created, create an album titled 'Untitled'
// router.use(checkIfAuthenticated);
router
  .get("/", PhotosController.getAll)
  .get("/:id")
  .post(
    "/",
    checkIfAuthenticated,
    asyncHandler(ImageUploader.upload),
    asyncHandler(ImageUploader.uploadToCloudinary),
    asyncHandler(PhotosController.addNewPhotos)
  )
  .put(":/id")
  .delete("/:id", asyncHandler(PhotosController.deleteItem));
export default router;
