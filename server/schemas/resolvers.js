const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, { username }) => {
      return User.findOne({ username });
    },

  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No User with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong!');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { User }, context) => {
      // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { User }, context) => {
      if (context.user) {
        const book = await User.findOne({
          savedBooks: bookId
        });
        await User.findOneAndUpdate(
          { savedBooks: bookId },
          { $pull: { savedBooks: bookId } },
          { new: true }
        )
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
