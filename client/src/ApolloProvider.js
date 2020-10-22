import React from "react";
import App from "./App";
import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { createHttpLink } from "@apollo/client/link/http";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  uri: "https://tranquil-anchorage-09814.herokuapp.com/",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwt-token");
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
