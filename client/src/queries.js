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

export const deleteUserQuery=gql`
  mutation ($id: ID!) {
    deleteUser(
      id: $id,
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

export const editFamilyNameFirstQuery=gql`
  mutation ($id: ID!, $familyNameFirst: Boolean!) {
    editFamilyNameFirst(
      id: $id,
      familyNameFirst: $familyNameFirst
    ) {
      id
    }
  }
`