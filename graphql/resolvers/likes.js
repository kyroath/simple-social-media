const { UserInputError } = require("apollo-server");
const Post = require("../../models/Post");

const checkAuth = require("../../util/checkAuth");

const likePost = async (_, { postId }, context) => {
  const { username } = checkAuth(context);

  const post = await Post.findById(postId);

  if (post) {
    if (post.likes.find((like) => like.username === username)) {
      // * Post already liked, unlike
      post.likes = post.likes.filter((like) => like.username !== username);
    } else {
      // * Post not liked, like
      post.likes.push({
        username,
        createdAt: new Date().toISOString(),
      });
    }

    await post.save();
    return post;
  }

  throw new UserInputError("Post not found");
};

module.exports = {
  Mutation: {
    likePost,
  },
};
