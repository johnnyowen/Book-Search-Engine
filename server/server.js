const express = require("express");
const path = require("path");
const db = require("./config/connection");
// import Apollo server so we can create an instance of it
const { ApolloServer } = require("apollo-server-express");
// schema definitions and resolver functions to define structure of our data
const { typeDefs, resolvers } = require("./schemas");
// import our authentication middleware
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// async function to start the server that takes typeDefs and resolvers as parameters
const startServer = async (typeDefs, resolvers) => {
  // starts the Apollo server instance
  await server.start();
  // integrate the Apollo server with the Express app
  server.applyMiddleware({ app });
  // executes the code once the database connection is established and open
  db.once("open", () => {
    // starts the app on the specified port and logs where it is ready
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
