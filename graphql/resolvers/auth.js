const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const Post = require("../../models/post");

const fetchUser = async userID => {
  const user = await User.findById(userID);

  return {
    ...user._doc,
    _id: user.id,
    createdPosts: fetchPosts.bind(this, user._doc.createdPosts)
  };
};

const fetchPosts = async postId => {
  const posts = await Post.find({ _id: { $in: postId } });

  return posts.map(post => {
    return {
      ...post._doc,
      _id: post.id,
      creator: fetchUser.bind(this, post.creator)
    };
  });
};

module.exports = {
  user: async (args, req) => {
    //Protect resolver
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    //End of protection
    const users = await User.find();
    return users.map(user => {
      return {
        ...user._doc,
        _id: user.id,
        createdPosts: fetchPosts.bind(this, user._doc.createdPosts)
      };
    });
  },

  createUser: async args => {
    const user = await User.findOne({ email: args.email });
    if (user) {
      throw new Error("User already existis.");
    }
    const hashedPassword = await bcrypt.hash(args.password, 12);
    const newUser = new User({
      name: args.name,
      email: args.email,
      password: hashedPassword
    });
    const result = await newUser.save();
    return {
      ...result._doc,
      password: null,
      _id: result.id,
      createdPosts: fetchPosts.bind(this, result._doc.createdPosts)
    };
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      throw new Error("User does not exist!");
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Invalid credentials!");
    }
    const token = jwt.sign(
      { userID: user.id, email: user.email },
      "supersecretkey",
      {
        expiresIn: "1h"
      }
    );
    return { userID: user.id, token: token, tokenExpiration: 1 };
  }
};
