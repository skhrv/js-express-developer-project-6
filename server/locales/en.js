// @ts-check

export default {
  translation: {
    appName: "Task Manager",
    flash: {
      session: {
        create: {
          success: "You are logged in",
          error: "Wrong email or password",
        },
        delete: {
          success: "You are logged out",
        },
      },
      users: {
        create: {
          error: "Failed to register",
          success: "User registered successfully",
        },
      },
      authError: "Access denied! Please login",
    },
    layouts: {
      application: {
        users: "Users",
        signIn: "Login",
        signUp: "Register",
        signOut: "Logout",
      },
    },
    views: {
      session: {
        new: {
          signIn: "Login",
          submit: "Login",
        },
      },
      users: {
        id: "ID",
        email: "Email",
        password: "Password",
        createdAt: "Created at",
        new: {
          submit: "Register",
          signUp: "Register",
        },
      },
      welcome: {
        index: {
          hello: "Hello!",
          description: "Task manager",
          more: "Learn more",
        },
      },
    },
  },
};
