import { ErrorRequestHandler, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response
) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: err.status || 401,
      message: "Invalid token",
    });
  }
  const error = err || {};
  req.app.get("env") === "production" ? null : { ...error, stack: err?.stack };

  const errorObj = {
    status: err?.status || 500,
    message: err?.message,
    error,
  };

  res.status(err?.status || 500).json(errorObj);
};
