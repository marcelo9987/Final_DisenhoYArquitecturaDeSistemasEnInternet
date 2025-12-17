import { gql } from 'apollo-server';



export const typeDefs = gql`
    type User{
    _id: ID!
    email: String!
    }
    
    type Query{
        me: User!
    }
    
    type Mutation{
        register(email: String!, password: String!): String!
        login(email: String!, password: String!): String!
    }
`;
