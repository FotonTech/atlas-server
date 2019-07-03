const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

let users = [];

let idCount = 0;

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    type Query {
        info: String!
        feed: [Link!]!
        user: [User!]!
      }
      
      type User {
        _id: ID!
        email: String!
        password: String
      }
      
      input UserInput {
        email: String!
        password: String!
      }
      
      type Mutation {
        post(url: String!, description: String!): Link!
        createUser(userInput: UserInput): User
      }
      
      type Link {
        id: ID!
        description: String!
        url: String!
      }
      
      schema {
        query: Query
        mutation: Mutation
      }
    `),
    rootValue: {
      Query: {
        info: () => {
          return `This is the API of a Hackernews Clone`;
        },
        feed: () => {
          return "teste";
        },
        user: () => {
          return users;
        }
      },

      Mutation: {
        post: (parent, args) => {
          const link = {
            id: `link-${idCount++}`,
            description: args.description,
            url: args.url
          };
          return link;
        },

        createUser: args => {
          const user = {
            _id: Math.random().toString(),
            email: args.userInput.email,
            password: args.userInput.password
          };
          users.push(user);
          return user;
        }
        // createUser: args => {
        //   return User.findOne({ email: args.userInput.email })
        //     .then(user => {
        //       if (user) {
        //         throw new Error("User already existis.");
        //       }
        //       return bcrypt.hash(args.userInput.password, 12);
        //     })
        //     .then(hashedPassword => {
        //       const user = new User({
        //         email: args.userInput.email,
        //         password: hashedPassword
        //       });
        //       return user.save();
        //     })
        //     .then(result => {
        //       return { ...result._doc, password: null, _id: result.id };
        //     })
        //     .catch(err => {
        //       throw err;
        //     });
        // }
      }
    },
    graphiql: true
  })
);

app.listen(3000);
