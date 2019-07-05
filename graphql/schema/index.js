const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Query {
    user: [User!]!
    login(email: String!, password: String!): AuthData!
  }


  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
  }

  type AuthData {
    userID: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
