const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const PORT = process.env.PORT || 5000;
const MONGODB = process.env.MONGODB || "";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cors: {
    origin: "https://simple-social-kyroath.netlify.app",
    credentials: true,
  },
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    return server.listen({
      port: PORT,
    });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
