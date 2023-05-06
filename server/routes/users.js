// @ts-check

import i18next from "i18next";
import { ValidationError } from "objection";

export default (app) => {
  app
    .get("/users", { name: "users" }, async (_, res) => {
      const users = await app.objection.models.user.query();
      res.render("users/index", { users });
      return res;
    })
    .get("/users/new", { name: "newUser" }, (_, res) => {
      const user = new app.objection.models.user();
      res.render("users/new", { user });
    })
    .post("/users", async (req, res) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);
      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash("info", i18next.t("flash.users.create.success"));
        res.redirect(app.reverse("root"));
      } catch (e) {
        if (e instanceof ValidationError) {
          req.flash("error", i18next.t("flash.users.create.error"));
          res.render("users/new", { user, errors: e.data });
        } else {
          req.log.error(e);
        }
      }

      return res;
    });
};
