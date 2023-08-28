const express = require("express");

const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const path = require("path");


const startServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 API Now listening on localhost:${PORT}`);
      console.log(
        `🚀 GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};
// call the function to start the server
startServer(typeDefs, resolvers);
