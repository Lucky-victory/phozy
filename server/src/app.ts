import express, { NextFunction, Response, Request } from "express";
const app = express();
const port = process.env.PORT || 3300;

import albumRoute from "./routes/Albums";
import signUpRoute from "./routes/Sign-up";
import signInRoute from "./routes/Sign-in";
import generalRoute from "./routes/General";
import photosRoute from "./routes/Photos";
import likesRoute from "./routes/Likes";
import usersRoute from "./routes/Users";
import { errorHandler } from "./middlewares/Error-handler";
import cors from "cors";
import createError from "http-errors";

// global middlewares
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
//app.use("/uploads", express.static("uploads"));
// routes
app.use("/api/sign-up", signUpRoute);
app.use("/api/sign-in", signInRoute);
app.use("/api/albums", albumRoute);
app.use("/api/photos", photosRoute);
app.use("/api/likes", likesRoute);
app.use("/api/profile", usersRoute);
app.use("/api", generalRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("PHOZY API 1.0");
});
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});
app.listen(port, () => {
  console.log("server running on port http://localhost:" + port);
});

export default app;
