const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Query {
    user: [User!]!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
