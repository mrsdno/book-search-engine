const { User, Book } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

// object called resolvers with a Query nested object that holds a series of methods
// method gets the same name as the query or mutation they are resolvers for
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks")
          .populate("friends");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    // here parent is a place holder parameter, need something here so we can access username as second parameter
    // accepts arguments in the following order: parent, args, context, info
    books: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Book.find(params).sort({ createdAt: -1 });
    },
    book: async (parent, { _id }) => {
      return Book.findOne({ _id });
    },
    users: async () => {
      return User.find().select("-_v -password").populate("savedBooks");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-_v -password")
        .populate("savedBooks");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect Credentials!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
        return res.json(updatedUser);
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    },
};

module.exports = resolvers;
