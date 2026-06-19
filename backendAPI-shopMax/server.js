import { createApp } from "./app.js";
import { env } from "./src/config/env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`ShopMax API listening on port ${env.PORT}`);
});
