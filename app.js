const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
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
    `),
    rootValue: {
      user: () => {
        return User.find()
          .then(users => {
            return users.map(user => {
              return { ...user._doc, _id: user.id };
            });
          })
          .catch(err => {
            throw err;
          });
      },

      createUser: args => {
        return User.findOne({ email: args.email })
          .then(user => {
            if (user) {
              throw new Error("User already existis.");
            }
            return bcrypt.hash(args.password, 12);
          })
          .then(hashedPassword => {
            const user = new User({
              name: args.name,
              email: args.email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            return { ...result._doc, password: null, _id: result.id };
          })
          .catch(err => {
            throw err;
          });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-sayzk.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
