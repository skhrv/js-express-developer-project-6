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
    .get("/users/new", { name: "createUserForm" }, (_, res) => {
      const user = new app.objection.models.user();
      res.render("users/new", { user });
    })
    .get("/users/:id/edit", { name: "editUser", preValidation: app.authenticate }, async (req, res) => {
      if (req.params.id !== String(req.user.id)) {
        req.flash("error", i18next.t("flash.users.update.denied"));
        res.redirect(app.reverse("users"));
        return res;
      }
      res.render("users/update", { user: req.user });
      return res;
    })
    .patch("/users/:id", { name: "updateUser", preValidation: app.authenticate }, async (req, res) => {
      if (req.params.id !== String(req.user.id)) {
        res.code(401);
        return res.send();
      }

      try {
        const user = await app.objection.models.user.query().findById(req.params.id);
        if (!user) {
          return app.notFound(req, res);
        }
        await user.$query().patch(req.body.data);
        req.flash("info", i18next.t("flash.users.update.success"));
        res.redirect(app.reverse("users"));
      } catch (error) {
        if (error instanceof ValidationError) {
          req.flash("error", i18next.t("flash.users.update.error"));
          res.render("users/update", { user: req.user, errors: error.data });
        } else {
          req.log.error(error);
        }
      }
      return res;
    })
    .delete("/users/:id", { name: "deleteUser", preValidation: app.authenticate }, async (req, res) => {
      if (req.params.id !== String(req.user.id)) {
        req.flash("error", i18next.t("flash.users.delete.denied"));
        res.redirect(app.reverse("users"));
        return res;
      }

      try {
        const deletedRows = await app.objection.models.user.query().deleteById(req.params.id);
        if (deletedRows === 0) {
          return app.notFound(req, res);
        }
        req.logOut();
        req.flash("info", i18next.t("flash.users.delete.success"));
        res.redirect(app.reverse("users"));
      } catch (error) {
        req.log.error(error);
        req.flash("error", i18next.t("flash.users.delete.error"));
      }
      return res;
    })
    .post("/users", { name: "createUser" }, async (req, res) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);
      try {
        await app.objection.models.user.query().insert(req.body.data);
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
