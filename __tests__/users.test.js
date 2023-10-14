// @ts-check

import _ from "lodash";
import fastify from "fastify";

import init from "../server/plugin.js";
import encrypt from "../server/lib/secure.cjs";
import { getTestData, prepareData, truncateAllTables, createSession } from "./helpers/index.js";

describe("test users CRUD", () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

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
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();

    await prepareData(app);
  });

  it("index", async () => {
    const response = await app.inject({
      method: "GET",
      url: app.reverse("users"),
    });

    expect(response.statusCode).toBe(200);
  });

  it("new", async () => {
    const response = await app.inject({
      method: "GET",
      url: app.reverse("createUserForm"),
    });

    expect(response.statusCode).toBe(200);
  });

  it("create", async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: "POST",
      url: app.reverse("users"),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, "password"),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it("update self", async () => {
    const params = testData.users.new;
    const existingUser = testData.users.existing1;

    const { id } = await models.user.query().findOne({ email: existingUser.email });
    const response = await app.inject({
      method: "PATCH",
      url: app.reverse("updateUser", { id }),
      payload: {
        data: params,
      },
    });

    console.log(id, response);
    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, "password"),
      passwordDigest: encrypt(params.password),
    };

    const notChangedUser = await models.user.query().findById(id);

    expect(notChangedUser).not.toMatchObject(expected);

    const cookies = await createSession(app, existingUser);
    const responseWithSession = await app.inject({
      method: "PATCH",
      url: app.reverse("updateUser", { id }),
      payload: {
        data: params,
      },
      cookies,
    });
    expect(responseWithSession.statusCode).toBe(302);
    const user = await models.user.query().findById(id);
    expect(user).toMatchObject(expected);
  });

  it("update other user. Should return 401", async () => {
    const params = testData.users.new;
    const existingUser = testData.users.existing1;
    const otherUser = testData.users.existing2;
    const { id } = await models.user.query().findOne({ email: existingUser.email });

    const cookies = await createSession(app, otherUser);
    const responseWithSession = await app.inject({
      method: "PATCH",
      url: app.reverse("updateUser", { id }),
      payload: {
        data: params,
      },
      cookies,
    });
    expect(responseWithSession.statusCode).toBe(401);
    const user = await models.user.query().findById(id);
    const expected = {
      ..._.omit(existingUser, "password"),
      passwordDigest: encrypt(existingUser.password),
    };
    expect(user).toMatchObject(expected);
  });

  it("delete self", async () => {
    const existingUser = testData.users.existing1;
    const otherUser = testData.users.existing2;
    const { id } = await models.user.query().findOne({ email: existingUser.email });
    const cookies = await createSession(app, existingUser);

    const response = await app.inject({
      method: "DELETE",
      url: app.reverse("deleteUser", { id }),
    });

    expect(await models.user.query().findById(id)).not.toBeUndefined();
    expect(response.statusCode).toBe(302);
    const responseWithSession = await app.inject({
      method: "DELETE",
      url: app.reverse("deleteUser", { id }),
      cookies,
    });

    expect(responseWithSession.statusCode).toBe(302);

    const user = await models.user.query().findById(id);
    expect(user).toBeUndefined();

    const secondResponse = await app.inject({
      method: "DELETE",
      url: app.reverse("deleteUser", { id }),
      cookies,
    });
    expect(secondResponse.statusCode).toBe(302);
  });

  it("delete other user", async () => {
    const existingUser = testData.users.existing1;
    const otherUser = testData.users.existing2;
    const { id } = await models.user.query().findOne({ email: existingUser.email });
    const cookies = await createSession(app, otherUser);

    const responseWithSession = await app.inject({
      method: "DELETE",
      url: app.reverse("deleteUser", { id }),
      cookies,
    });

    expect(responseWithSession.statusCode).toBe(302);

    const user = await models.user.query().findById(id);
    expect(user).not.toBeUndefined();
  });

  afterEach(async () => {
    await truncateAllTables(app);
  });

  afterAll(async () => {
    await app.close();
  });
});
