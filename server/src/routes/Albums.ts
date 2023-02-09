import { Router } from "express";
import asyncHandler from "express-async-handler";
import { checkIfAuthenticatedOptional } from "../middlewares/Auth";

import AlbumsController from "../controllers/Albums";
import { checkIfAuthenticated } from "../middlewares/Auth";
import Validators from "../middlewares/validators";

const router = Router();

router.get("/", checkIfAuthenticatedOptional, AlbumsController.getAll);
router.get(
  "/:album_id",
  checkIfAuthenticatedOptional,
  asyncHandler(AlbumsController.getById)
);

router
  .use(checkIfAuthenticated)
  .post(
    "/",
    Validators.validateAlbumAdd(),
    Validators.validationResult,
    asyncHandler(AlbumsController.create)
  )
  .put("/:album_id", asyncHandler(AlbumsController.update))
  .put("/:album_id/photo", asyncHandler(AlbumsController.addPhoto))
  .delete("/:album_id", asyncHandler(AlbumsController.delete));

export default router;
