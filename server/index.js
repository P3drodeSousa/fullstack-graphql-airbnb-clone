import { GraphQLServer } from "graphql-yoga";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { makeExecutableSchema } from 'graphql-tools';
import path from "path";
import session from "express-session";


import models from "./models";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./types")));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const server = new GraphQLServer({
    schema,
    context: ({ request }) => ({
      models,
      session: request.session,
      req: request
    })
  });

  server.express.use(
    session({
      name: "qid",
      secret: "oiiiirwerrji",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  const cors = {
    origin: "http://localhost:3000",
    credentials: true
  };

  await models.sequelize.sync();

  await server.start({
    cors,
    port: 4000
  });

  console.log("Server is running on localhost:4000");
};

startServer();