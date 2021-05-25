import { gql  } from '@apollo/client'

//Can improve to make more specific query
export const getAllUsersQuery=gql`
  {
    users {
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

// export const addUserQuery=gql`
//   mutation {
//       addUser($username: String!, $password: String!, $email: String!, $accountType: String!, name: {$givenName: String!, $familyName: String!})
//   }
// `
