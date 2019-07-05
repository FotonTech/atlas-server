const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  user: async (args, req) => {
    //Protect resolver
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    //End of protection
    const users = await User.find();
    return users.map(user => {
      return { ...user._doc, _id: user.id };
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
    return { ...result._doc, password: null, _id: result.id };
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
