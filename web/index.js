import dotenv from "dotenv";
dotenv.config();

// @ts-check
import { join } from "path";
import { existsSync, mkdirSync, readFile, readFileSync, writeFile } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

// Custom Controllers
import {
  createStorePage,
  getStorePages,
} from "./server/controllers/store-pages/index.js";

// Middleware
import checkStorePageExits from "./server/middlewares/checkStorePageExits.js";
import { getRecipesFromChatGPT } from "./server/controllers/recipes/index.js";
import createRecipeProduct from "./server/controllers/products/createRecipeProduct.js";
import cors from "cors";
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res, next) => {
    try {
      // When App Installed first time, show create prompt file inside server/prompts
      let _promptDir = `server/prompts`;
      let _defaultPrompt = `Please provide five <cuisine> <dietary> <type> cuisine recipes that is suitable for <no_of_people> adults and includes <protein> protein sources. The ingredients should be listed in the metric system and using New Zealand terminology, and the instructions should also use New Zealand terminology. Additionally, please include any nutritional information and information on allergens. The ingredients used in the recipes should be in season in New Zealand, as it is currently the month of <month>`;

      // if prompts directory not find then create
      if (!existsSync(_promptDir)) {
        mkdirSync(_promptDir);
      }

      // save prompt in prompts folder
      await writeFile(
        `${_promptDir}/${res.locals.shopify.session.shop}.txt`,
        _defaultPrompt,
        function (err) {
          if (err) {
            console.log("Error Error: ", err);
            return;
          }
          return;
        }
      );
    } catch (error) {
      console.log("Error: ", error);
    }

    next();
  },
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use(express.json());
app.use(cors());

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js
// Store front
app.route("/api/store-front/recipes").post(getRecipesFromChatGPT);
app.route("/api/store-front/create-recipe-product").post(createRecipeProduct);
// app.route("/api/store-front/delete-recipe-product").post(createRecipeProduct)
// app.route("/api/get-front/delete-recipe-product").post(createRecipeProduct)

app.use("/api/*", shopify.validateAuthenticatedSession());

// APIs Start
app.route("/api/app/store-pages").get(getStorePages).post(createStorePage);

app.route("/api/app/store-page/:pageID").all(checkStorePageExits);

app
  .route("/api/prompt")
  .get(async (req, res) => {
    readFile(
      `server/prompts/${res.locals.shopify.session.shop}.txt`,
      "utf8",
      (err, data) => {
        if (err) {
          return res.status(200).send({ error: "prompt not found" });
        }

        return res.status(200).send({ prompt: data });
      }
    );
  })
  .post(async (req, res) => {
    try {
      // When App Installed first time, show create prompt file inside server/prompts
      let _promptDir = `server/prompts`;

      // if prompts directory not find then create
      if (!existsSync(_promptDir)) {
        mkdirSync(_promptDir);
      }

      // Read Old Data
      readFile(
        `${_promptDir}/${res.locals.shopify.session.shop}.txt`,
        "utf8",
        (err, readData) => {
          if (err) {
            return res.status(200).send({ error: "Prompt not updated" });
          }

          // Write New Data
          writeFile(
            `${_promptDir}/${res.locals.shopify.session.shop}.txt`,
            req.body.prompt,
            function (err) {
              if (err) {
                return res.status(200).send({ prompt: readData });
              }

              return res.status(200).send({ prompt: req.body.prompt });
            }
          );
        }
      );
    } catch (error) {
      res.status(200).send({ error: "Prompt not created." });
    }
  });

// APIs End

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
