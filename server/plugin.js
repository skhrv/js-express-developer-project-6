// @ts-check

import { fileURLToPath } from "url";
import dotenv from "dotenv";
import path from "path";
import fastifyStatic from "@fastify/static";
// NOTE: не поддердивает fastify 4.x
// import fastifyErrorPage from 'fastify-error-page';
import fastifyView from "@fastify/view";
import fastifyFormbody from "@fastify/formbody";
import fastifySecureSession from "@fastify/secure-session";
import { default as fastifyPassport } from "@fastify/passport";
import fastifySensible from "@fastify/sensible";
import { plugin as fastifyReverseRoutes } from "fastify-reverse-routes";
import fastifyMethodOverride from "fastify-method-override";
import fastifyObjectionjs from "fastify-objectionjs";
import qs from "qs";
import Pug from "pug";
import i18next from "i18next";
import ru from "./locales/ru.js";
import en from "./locales/en.js";
import addRoutes from "./routes/index.js";
import getHelpers from "./helpers/index.js";
import * as knexConfig from "../knexfile.js";
import models from "./models/index.js";
import FormStrategy from "./lib/passportStrategies/FormStrategy.js";

const __dirname = fileURLToPath(path.dirname(import.meta.url));
const mode = process.env.NODE_ENV || "development";
// const isDevelopment = mode === 'development';

dotenv.config();

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, "..", "server", "views"),
  });

  app.decorateReply("render", function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, "..", "dist");
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: "/assets/",
  });
};

const setupLocalization = async () => {
  await i18next.init({
    lng: "en",
    fallbackLng: "ru",
    // debug: isDevelopment,
    resources: {
      ru,
      en,
    },
  });
};

const addHooks = (app) => {
  app.addHook("preHandler", async (req, res) => {
    res.locals = {
      isAuthenticated: () => req.isAuthenticated(),
    };
  });
};

const registerPlugins = async (app) => {
  await app.register(fastifySensible);
  await app.register(fastifyReverseRoutes);
  await app.register(fastifyFormbody, { parser: qs.parse });
  await app.register(fastifySecureSession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: "/",
    },
  });

  fastifyPassport.registerUserDeserializer(async (user) => {
    const foundUser = await app.objection.models.user.query().findById(user.id);

    return foundUser ?? null;
  });
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.use(new FormStrategy("form", app));
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());

  await app.decorate("fp", fastifyPassport);
  app.decorate("authenticate", (...args) =>
    fastifyPassport.authenticate(
      "form",
      {
        failureRedirect: app.reverse("root"),
        failureFlash: i18next.t("flash.authError"),
      },
      // @ts-ignore
    )(...args),
  );

  app.decorate("notFound", (_, res) => {
    res.code(404).type("text/html").send("Not Found");
  });

  await app.register(fastifyMethodOverride);

  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });
};

export const options = {
  exposeHeadRoutes: false,
};

// eslint-disable-next-line no-unused-vars
export default async (app, _options) => {
  await registerPlugins(app);

  await setupLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);
  addHooks(app);

  return app;
};
