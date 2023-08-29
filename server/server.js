const express = require("express");
const path = require("path");
const db = require("./config/connection");

const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// setting up our Apollo server touse type definitions and GraphQL resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const startServer = async (typeDefs, resolvers) => {
  // starting the Apollo Server
  await server.start();
  // applies Apollo Server middleware to our Express app allowingus to use GrapgQL through the same endpoint as our Express app
  server.applyMiddleware({ app });

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }
  // route handles any GET request that doesn't match the previous route
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
  // once database connection is established, start the server and log the endpoints 
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
