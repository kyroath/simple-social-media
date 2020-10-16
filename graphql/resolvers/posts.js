const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");

const checkAuth = require("../../util/checkAuth");

const getPosts = async () => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return posts;
  } catch (err) {
    throw new Error(err);
  }
};

const getPost = async (_, { postId }) => {
  try {
    const post = await Post.findById(postId);
    if (post) {
      return post;
    }

    throw new Error("Post not found");
  } catch (err) {
    throw new Error(err);
  }
};

const createPost = async (_, { body }, context) => {
  const user = checkAuth(context);

  if (body.trim() === "") {
    throw new UserInputError("Post body must not be empty");
  }

  const newPost = new Post({
    body,
    user: user.id,
    username: user.username,
    createdAt: new Date().toISOString(),
  });

  const post = await newPost.save();
  return post;
};

const deletePost = async (_, { postId }, context) => {
  const user = checkAuth(context);

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (user.username === post.username) {
      await post.delete();
      return "Post deleted successfully";
    }

    throw new AuthenticationError("Action not allowed");
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  Query: {
    getPosts,
    getPost,
  },
  Mutation: {
    createPost,
    deletePost,
  },
};
