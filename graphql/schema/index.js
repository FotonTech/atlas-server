const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Query {
    user: [User!]!
    post: [Post!]!
    login(email: String!, password: String!): AuthData!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    createdPosts: [Post!]
  }

  type Post {
    _id: ID!
    content: String!
    date: String!
    creator: User!
  }

  type AuthData {
    userID: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    createPost(content: String!, date: String!) : Post!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
