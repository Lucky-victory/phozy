import { Router } from "express";
import asyncHandler from "express-async-handler";
import ImageUploader from "../utils/Image-uploader";

import UsersController from "../controllers/Users";
import {
  checkIfAuthenticated,
  checkIfAuthenticatedOptional,
} from "../middlewares/Auth";
const router = Router();

router.get(
  "/:username",
  checkIfAuthenticatedOptional,
  asyncHandler(UsersController.getUserByUsername)
);

router.get(
  "/:username/albums",
  checkIfAuthenticatedOptional,
  asyncHandler(UsersController.getAlbumsByUser)
);
router.get("/:username/photos", asyncHandler(UsersController.getPhotosByUser));

// route to update profile image only
router.post(
  "/update/profile-image",
  checkIfAuthenticated,
  asyncHandler(UsersController.checkIfUserExist),

  asyncHandler(ImageUploader.profileImageUpload),
  asyncHandler(UsersController.updateProfileImage)
);

export default router;
