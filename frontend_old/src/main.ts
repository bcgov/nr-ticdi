import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import path, { join, resolve } from "path";
import { AppModule } from "./app.module";
import * as hbs from "hbs";
import * as expressSession from "express-session";
const fileSession = require("session-file-store")(expressSession);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views/pages"));
  hbs.registerPartials(join(__dirname, "..", "views/partials"));
  hbs.registerPartials(join(__dirname, "..", "views/layout"));
  app.setViewEngine("hbs");
  hbs.registerHelper("json", function (context) {
    return JSON.stringify(context);
  });
  // used on the manage-templates page
  hbs.registerHelper("dots", function (variant_name) {
    const count = 100 - variant_name.length;
    return ".".repeat(count);
  });

  let sessionOptions: expressSession.SessionOptions;
  sessionOptions = {
    secret: process.env.cookie_secret,
    resave: false,
    saveUninitialized: false,
    store: new fileSession({ path: resolve("./", process.env.session_path) }),
    cookie: { maxAge: 1800000, secure: false, httpOnly: true },
  };

  app.use(expressSession(sessionOptions));

  await app.listen(3000);
}
bootstrap();