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

export const submitPostQuery=gql`
  mutation ($user: User!, $date: Date!, $postType: String!, $privacy: String!, $imageFilePath: String, $videoFilePath: String, $tagged: [Pet]!, $location: String, $text: String!, $likedBy: [User]!, $comments: [Comment]!, $isEdited: Boolean!) {
    addPost(
      user: $id,
      date: $date,
      postType: $postType,
      privacy: $privacy,
      imageFilePath: $imageFilePath,
      videoFilePath: $videoFilePath,
      tagged: $tagged,
      location: $location,
      text: $text,
      likedBy: $likedBy,
      comments: $comments,
      isEdited: $isEdited
    ) {
      id
    }
  }
`

export const getPostsQuery=gql`
  query {
    getPosts {
      id
      user {
        id
        username
        accountType
        name {
          givenName
          familyName
        }
        avatarPath
        otherSettings {
          familyNameFirst
        }
      }
      date
      postType
      privacy
      imageFilePath
      videoFilePath
      location
      text
      comments {
        user {
          name {
            givenName
            familyName
          }
          otherSettings {
            familyNameFirst
          }
          avatarPath
        }
        text
      }
      isEdited
    }
  }
`