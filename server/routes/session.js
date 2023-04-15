// @ts-check

import i18next from "i18next";

export default (app) => {
  app
    .get("/session/new", { name: "newSession" }, (_, res) => {
      const signInForm = {};
      res.render("session/new", { signInForm });
    })
    .post(
      "/session",
      { name: "session" },
      app.fp.authenticate("form", async (req, res, err, user) => {
        if (err) {
          return app.httpErrors.internalServerError(err);
        }
        if (!user) {
          const signInForm = req.body.data;
          const errors = {
            email: [{ message: i18next.t("flash.session.create.error") }],
          };
          res.render("session/new", { signInForm, errors });
          return res;
        }
        await req.logIn(user);
        req.flash("success", i18next.t("flash.session.create.success"));
        res.redirect(app.reverse("root"));
        return res;
      }),
    )
    .delete("/session", (req, res) => {
      req.logOut();
      req.flash("info", i18next.t("flash.session.delete.success"));
      res.redirect(app.reverse("root"));
    });
};
