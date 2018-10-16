import formatErrors from "../formatErrors";
import bcrypt from "bcryptjs";

export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } })
  },
  Mutation: {
    register: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);
        console.log(args);
        return {
          ok: true,
          user
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models)
        };
      }
    },
    login: async (parent, { email, password }, { models, session }) => {
      const user = await models.User.findOne({ where: { email } });

      if (!user) {
        return {
          ok: false,
          message: "user not found"
        };
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return {
          ok: false,
          message: "Wrong password"
        };
      }

      // login sucessful
      session.userId = user.id;

      console.log(session.userId);

      return {
        ok: true,
        message: "User logged in"
      };
    },
    logout: async (parent, args, { session }) => {
       const { userId } = session;

      if (userId) {
        session.destroy(err => {
          if (err) {
            console.log(err);
          }
        });
        return true;
      } 

      return false;
    }
  }
};
