const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links
  },

  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },
    createUser: args => {
      return User.findOne({ email: args.userInput.email })
        .then(user => {
          if (user) {
            throw new Error("User already existis.");
          }
          return bcrypt.hash(args.userInput.password, 12);
        })
        .then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
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
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

mongoose
  .connect(
    "mongodb+srv://pauloabd:tO473SwhZWPJ5u6S@cluster0-sayzk.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then()
  .catch(err => {
    console.log(err);
  });

server.start(() => console.log(`Server is running on http://localhost:4000`));
