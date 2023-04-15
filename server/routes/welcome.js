// @ts-check

export default (app) => {
  app
    .get("/", { name: "root" }, (_, res) => {
      res.render("welcome/index");
    })
    .get("/protected", { name: "protected", preValidation: app.authenticate }, (_, res) => {
      res.render("welcome/index");
    });
};
