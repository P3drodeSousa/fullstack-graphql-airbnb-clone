import { isAuthenticated } from "../auth";

export default {
  Query: {
    hello: async (parent, { name }, { session }) => {
        await isAuthenticated(session);
        return `Hello ${session.userId}`
    }
  }
};
