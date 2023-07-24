import { gql } from "apollo-angular";

export const GET_USERS=gql`
query{
    allUsers{
     id,
     firstName,
     lastName,
     email,
     password,
     phone,
     country
   }
 }
`
export const GET_Search = gql`
query($userFilter:UserFilter){
  allUsers(filter:$userFilter){
    id
    firstName
    lastName,
    email,
    password,
    phone,
    country
  }
}
`