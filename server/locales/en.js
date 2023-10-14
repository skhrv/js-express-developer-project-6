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
        update: {
          error: "Failed to update",
          success: "User updated successfully",
          denied: "Access denied",
        },
        delete: {
          denied: "Access denied",
          success: "User deleted successfully",
          error: "Failed to delete",
        },
      },
      authError: "Access denied! Please login",
    },
    layouts: {
      application: {
        users: "Users",
        signIn: "Login",
        signUp: "Register",
        logout: "Logout",
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
        fullName: "Full name",
        firstName: "First name",
        lastName: "Last name",
        password: "Password",
        createdAt: "Created at",
        actions: "Actions",
        new: {
          submit: "Register",
          signUp: "Register",
        },
        profile: "Profile",
        edit: {
          submit: "Save",
        },
        editUser: "Edit",
        deleteUser: "Delete",
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
