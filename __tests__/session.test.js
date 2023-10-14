// @ts-check

import fastify from "fastify";
import init from "../server/plugin.js";
import { getTestData, prepareData, truncateAllTables, createSession } from "./helpers/index.js";

describe("test session", () => {
  let app;
  let knex;
  let testData;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: {
        transport: {
          target: "pino-pretty",
        },
      },
    });
    await init(app);
    knex = app.objection.knex;
    testData = getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();

    await prepareData(app);
  });

  it("test sign in / sign out", async () => {
    const response = await app.inject({
      method: "GET",
      url: app.reverse("newSession"),
    });

    expect(response.statusCode).toBe(200);

    const cookies = await createSession(app, testData.users.existing1);

    const responseSignOut = await app.inject({
      method: "DELETE",
      url: app.reverse("session"),
      cookies,
    });

    expect(responseSignOut.statusCode).toBe(302);
  });

  afterEach(async () => {
    await truncateAllTables(app);
  });

  afterAll(async () => {
    await app.close();
  });
});
