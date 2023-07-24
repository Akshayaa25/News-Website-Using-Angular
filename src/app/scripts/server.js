const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    country: String!
    password: String!
    contactNumber: String!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, country: String!, password: String!, contactNumber: String!): User
  }
`;

const users = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    country: 'USA',
    password: 'password123',
    contactNumber: '1234567890',
  },
];

const resolvers = {
  Query: {
    getUser: (parent, { id }) => {
      return users.find(user => user.id === id);
    },
    getUsers: () => {
      return users;
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      const newUser = {
        id: String(users.length + 1),
        ...args,
      };

      users.push(newUser);

      return newUser;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});