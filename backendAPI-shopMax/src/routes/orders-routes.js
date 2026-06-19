import { Router } from "express";
import {
  cancelOrderController,
  getOrderByIdController,
  listOrdersController
} from "../controllers/orders-controller.js";
import { requireAuth } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { orderCancelSchema } from "../validators/order-validator.js";

export const ordersRouter = Router();

ordersRouter.get("/orders", requireAuth, listOrdersController);
ordersRouter.get("/orders/:orderId", requireAuth, getOrderByIdController);
ordersRouter.post("/orders/:orderId/cancel", requireAuth, validateBody(orderCancelSchema), cancelOrderController);
