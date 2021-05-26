import { gql  } from '@apollo/client'

//Can improve to make more specific query
export const allUsersQuery=gql`
  query {
    allUsers {
      id
      username
      password
      name {
          givenName
          familyName
      }
      accountType
      avatarPath
      otherSettings {
          familyNameFirst
          defaultPrivacy
      }
    }
  }
`

export const addUserQuery=gql`
  mutation ($username: String!, $password: String!, $email: String!, $accountType: String!, $givenName: String!, $familyName: String!) {
    addUser(
      username: $username,
      password: $password,
      email: $email,
      accountType: $accountType,
      givenName: $givenName,
      familyName: $familyName
    ) {
      id
    }
  }
`

export const editPasswordQuery=gql`
  mutation ($id: ID!, $password: String!) {
    editPassword(
      id: $id,
      password: $password
    ) {
      id
    }
  }
`