const Post = require("../../models/post");
const User = require("../../models/user");

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

  posts.map(post => {
    return {
      ...post._doc,
      _id: post.id,
      date: new Date(post._doc.date).toISOString(),
      creator: fetchUser.bind(this, post.creator)
    };
  });
  return posts;
};

module.exports = {
  post: async (args, req) => {
    //Protect resolver
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    //End of protection
    const post = await Post.find();

    return post.map(post => {
      return {
        ...post._doc,
        _id: post.id,
        date: new Date(post._doc.date).toISOString(),
        creator: fetchUser.bind(this, post._doc.creator)
      };
    });
  },

  createPost: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("To post something you need to login first!");
    // }
    const post = new Post({
      date: args.date,
      content: args.content,
      creator: req.userID
    });
    const result = await post.save();
    const createdPost = {
      ...result._doc,
      _id: result._doc._id.toString(),
      date: new Date(result._doc.date.toISOString()),
      creator: fetchUser.bind(this, result._doc.creator)
    };
    const user = await User.findById(req.userID);

    if (!user) {
      throw new Error("User not found.");
    }

    user.createdPosts.push(post);
    const postUser = await user.save();

    return createdPost;
  }
};
