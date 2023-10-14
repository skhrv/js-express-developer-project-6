// @ts-check

export default {
  translation: {
    appName: "Менеджер задач",
    flash: {
      session: {
        create: {
          success: "Вы залогинены",
          error: "Неправильный емейл или пароль",
        },
        delete: {
          success: "Вы разлогинены",
        },
      },
      users: {
        create: {
          error: "Не удалось зарегистрировать",
          success: "Пользователь успешно зарегистрирован",
        },
        update: {
          denied: "Нельзя редактировать другого пользователя",
          error: "Не удалось обновить данные пользователя",
          success: "Пользователь успешно обновлён",
        },
        delete: {
          denied: "Нельзя удалить другого пользователя",
          success: "Пользователь успешно удалён",
          error: "Не удалось удалить пользователя",
        },
      },
      authError: "Доступ запрещён! Пожалуйста, авторизируйтесь.",
    },
    layouts: {
      application: {
        users: "Пользователи",
        signIn: "Вход",
        signUp: "Регистрация",
        logout: "Выход",
      },
    },
    views: {
      session: {
        new: {
          signIn: "Вход",
          submit: "Войти",
        },
      },
      users: {
        id: "ID",
        email: "Email",
        fullName: "Полное имя",
        firstName: "Имя",
        lastName: "Фамилия",
        password: "Пароль",
        createdAt: "Дата создания",
        actions: "Действия",
        new: {
          submit: "Сохранить",
          signUp: "Регистрация",
        },
        editUser: "Изменить",
        deleteUser: "Удалить",
      },
      welcome: {
        index: {
          hello: "Привет от Хекслета!",
          description: "Практические курсы по программированию",
          more: "Узнать Больше",
        },
      },
    },
  },
};
