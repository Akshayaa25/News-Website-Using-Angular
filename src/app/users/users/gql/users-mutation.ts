import { gql } from "apollo-angular";

export const CREATE_User = gql`
mutation ($firstName:String!,$lastName:String!,$email:String!,$password:String!,$phone:String!,$country:String!){
  createUser(firstName:$firstName,lastName:$lastName,email:$email,password:$password,phone:$phone,country:$country){
    id,
    firstName,
    lastName,
    email,
    password,
    phone,
    country,
  }
}
`
export const DELETE_USER=gql`
mutation($id:ID!){
  removeUser(id:$id){
    id
    firstName
    lastName
    email
    phone
    country
  }
}
`
export const UPDATE_USER = gql`
mutation UpdateUser(
  $id: ID!
  $firstName: String!
  $lastName: String!
  $email: String!
  $password: String!
  $phone: String!
  $country: String!
) {
  updateUser(
    id: $id
    firstName: $firstName
    lastName: $lastName
    email: $email
    password: $password
    phone:$phone
    country: $country
  ) {
    id
    firstName
    lastName
    email
    phone
    country
  }
}
`

export const RESET_PASSWORD = gql`
  mutation ResetPassword($id: ID!, $password: String!) {
    resetPassword(id: $id, password: $password){
      password
    }
  }
`
