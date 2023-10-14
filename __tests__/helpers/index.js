// @ts-check

import { URL } from "url";
import fs from "fs";
import path from "path";

// TODO: использовать для фикстур https://github.com/viglucci/simple-knex-fixtures

const getFixturePath = (filename) => path.join("..", "..", "__fixtures__", filename);
const readFixture = (filename) => fs.readFileSync(new URL(getFixturePath(filename), import.meta.url), "utf-8").trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData("testData.json");

export const prepareData = async (app) => {
  const { knex } = app.objection;

  // получаем данные из фикстур и заполняем БД
  await knex("users").insert(getFixtureData("users.json"));
};

/** Вместо rollback используем truncate, т.к при роллбэке возникает ошибка segmentation fault (core dumped) */
export const truncateAllTables = async (app) => {
  await app.objection.knex("users").truncate();
};

/** Хелпер для создания сессии */
export const createSession = async (app, user) => {
  const responseSignIn = await app.inject({
    method: "POST",
    url: app.reverse("session"),
    payload: {
      data: user,
    },
  });
  expect(responseSignIn.statusCode).toBe(302);

  // после успешной аутентификации получаем куки из ответа,
  // они понадобятся для выполнения запросов на маршруты требующие
  // предварительную аутентификацию
  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  const cookie = { [name]: value };
  return cookie;
};
