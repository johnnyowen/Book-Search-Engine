// import user model
const { User } = require("../models");
// import sign token function from auth
const { signToken } = require("../utils/auth");
// imports an authentication error if we need one
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    // returns the logged in users data from a search of the database
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          // finds saved books from the user's saved books array and makes it available
          .populate("savedBooks");
        return userData;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    // mutation to handle login, returns a token created with user data, and also returns the user data
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials!");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials!");
      }
      const token = signToken(user);
      return { token, user };
    },
    // mutation to handle addUser, returns a token created with user data, and also returns the user data
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    // mutation to handle saveBook, adds a book to the user's saved books array, and returns the updated user data
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // mutation to handle removeBook, pulls a book to the user's saved books array, and returns the updated user data
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
