import cors from "cors";
import express from "express";
import { fileURLToPath } from "node:url";
import { authenticateRequest } from "./src/middlewares/authenticate-request.js";
import { apiRouter } from "./src/routes/index.js";
import { notFoundMiddleware } from "./src/middlewares/not-found.js";
import { errorHandlerMiddleware } from "./src/middlewares/error-handler.js";

const uploadsProductsDirectory = new URL("./uploads/products/", import.meta.url);

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(
    "/uploads/products",
    express.static(fileURLToPath(uploadsProductsDirectory), {
      dotfiles: "deny",
      fallthrough: false,
      index: false,
      redirect: false
    })
  );
  app.use(authenticateRequest);
  app.use("/api", apiRouter);
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
