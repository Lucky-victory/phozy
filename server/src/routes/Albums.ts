import { Router } from "express";
import asyncHandler from "express-async-handler";
import { checkIfAuthenticatedOptional } from "./../middlewares/Auth";

import AlbumsController from "../controllers/Albums";
import { checkIfAuthenticated } from "../middlewares/Auth";
import Validators from "../middlewares/validators";

const router = Router();

router.get("/", checkIfAuthenticatedOptional, AlbumsController.getAlbums);
router.get(
  "/:album_id",
  checkIfAuthenticatedOptional,
  asyncHandler(AlbumsController.getAlbumById)
);

router
  .use(checkIfAuthenticated)
  .post(
    "/",
    Validators.validateAlbumAdd(),
    Validators.validationResult,
    asyncHandler(AlbumsController.createNewAlbum)
  )
  .put("/:album_id", asyncHandler(AlbumsController.updateAlbum))
  .delete("/:album_id", asyncHandler(AlbumsController.deleteAlbum));

export default router;
