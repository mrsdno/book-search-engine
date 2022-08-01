// import the gql tagged template function
const { gql } = require("apollo-server-express");

// create our typeDefs
// create a query named helloWorld and specify that the type of data to be returned by this query will be a string
// the though
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    email: String
    bookCount: String
    savedBooks: [Book]
  }
  type Book {
    _id: ID
    bookId: String
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    books: [Book]
    book(_id: ID!): Book
  }

  input saveBookInput {
    bookId: String
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(criteria: saveBookInput): User
    removeBook(bookId: ID!): User
  }

  type Auth {
    token: ID!
    user: User
  }
`;

// export the typeDefs
module.exports = typeDefs;
