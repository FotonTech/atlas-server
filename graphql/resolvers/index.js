const bcrypt = require("bcryptjs");

const User = require("../../models/user");

module.exports = {
  user: async () => {
    const users = await User.find();
    users.map(user => {
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
  }
};
