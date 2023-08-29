import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

import { setContext } from "@apollo/client/link/context";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
// a function from Apollo Client is used to create an HTTP link that is configured to send requests to the "/graphql" endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});
// adds a header to each request that retrieves the id_token from the local storage and includes it in the authorization header as a bearer token (Bearer ${token})
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
// creating oout instance of Apollo Client
const client = new ApolloClient({
  // authLink and httpLink are combined using concat() to create a single link that first applies the authorization headers and then sends the HTTP request
  link: authLink.concat(httpLink),
  // instance is used to cache the data returned from GraphQL queries and mutations
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchBooks />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
