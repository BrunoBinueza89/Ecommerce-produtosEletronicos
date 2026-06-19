import { Router } from "express";
import { authRouter } from "./auth-routes.js";
import { usersRouter } from "./users-routes.js";
import { categoriesRouter } from "./categories-routes.js";
import { brandsRouter } from "./brands-routes.js";
import { productsRouter } from "./products-routes.js";
import { cartRouter } from "./cart-routes.js";
import { customersRouter } from "./customers-routes.js";
import { checkoutRouter } from "./checkout-routes.js";
import { ordersRouter } from "./orders-routes.js";
import { adminRouter } from "./admin-routes.js";
import { contentRouter } from "./content-routes.js";
import { favoritesRouter } from "./favorites-routes.js";
import { reviewsRouter } from "./reviews-routes.js";
import { engagementRouter } from "./engagement-routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "shopmax-api",
    version: "0.1.0"
  });
});

apiRouter.use(authRouter);
apiRouter.use(usersRouter);
apiRouter.use(categoriesRouter);
apiRouter.use(brandsRouter);
apiRouter.use(productsRouter);
apiRouter.use(cartRouter);
apiRouter.use(customersRouter);
apiRouter.use(checkoutRouter);
apiRouter.use(ordersRouter);
apiRouter.use(contentRouter);
apiRouter.use(favoritesRouter);
apiRouter.use(reviewsRouter);
apiRouter.use(engagementRouter);
apiRouter.use(adminRouter);
