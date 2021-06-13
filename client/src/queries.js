import { gql  } from '@apollo/client'

//Can improve to make more specific query
export const allUsersQuery=gql`
  query {
    allUsers {
      id
      username
      password
      email
      profileBio
      name {
          givenName
          familyName
      }
      accountType
      avatarPath
      settings {
          familyNameFirst
          defaultPrivacy
          likeNotification
          commentNotification
          shareNotification
      }
    }
  }
`

export const currentUserQuery=gql`
 query {
   me {
    id
    username
    password
    email
    profileBio
    name {
        givenName
        familyName
    }
    friends {
      username
    }
    blockedUsers {
      username
    }
    posts {
      id
      postType
      imageFilePath
      videoFilePath
    }
    savedPosts {
      id
      postType
      imageFilePath
      videoFilePath
    }
    registeredDate
    accountType
    avatarPath
    pets {
      id
      name
      picturePath
    }
    settings {
        familyNameFirst
        defaultPrivacy
        likeNotification
        commentNotification
        shareNotification
    }
   }
 }
`

export const getPostByIdQuery=gql`
  query ($id: ID!) {
    findPost(id: $id) {
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
        settings {
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
          settings {
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

export const getPetByIdQuery=gql`
  query ($id: ID!) {
    findPet(id: $id) {
      id
      name
      owners {
        id
        avatarPath
        name {
          givenName
          familyName
        }
        settings {
          familyNameFirst
        }
      }
      dateOfBirth
      gender
      breed
      picturePath
    }
  }
`

export const addUserQuery=gql`
  mutation ($username: String!, $password: String!, $confirmPassword: String!, $email: String!, $accountType: String!, $givenName: String!, $familyName: String!) {
    addUser(
      username: $username,
      password: $password,
      confirmPassword: $confirmPassword,
      email: $email,
      accountType: $accountType,
      givenName: $givenName,
      familyName: $familyName
    ) {
      id
    }
  }
`

export const addPetOwnerQuery=gql`
  mutation ($id: ID!, $username: String!) {
    addPetOwner(
      id: $id,
      username: $username
    ) {
      id
    }
  }
`

export const deleteUserQuery=gql`
  mutation ($id: ID!, $password: String!) {
    deleteUser(
      id: $id,
      password: $password
    ) {
      id
    }
  }
`

export const loginQuery = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const editEmailQuery=gql`
  mutation ($id: ID!, $email: String!) {
    editEmail(
      id: $id,
      email: $email
    ) {
      id
    }
  }
`

export const resetPasswordQuery=gql`
  mutation ($email: String!, $password: String! $confirmPassword: String!) {
    resetPassword(
      email: $email,
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
    }
  }
`

export const editPasswordQuery=gql`
  mutation ($id: ID!, $password: String! $newPassword: String!) {
    editPassword(
      id: $id,
      password: $password
      newPassword: $newPassword
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

export const editLikeNotificationQuery=gql`
  mutation ($id: ID!, $likeNotification: Boolean!) {
    editLikeNotification(
      id: $id,
      likeNotification: $likeNotification
    ) {
      id
    }
  }
`

export const editCommentNotificationQuery=gql`
  mutation ($id: ID!, $commentNotification: Boolean!) {
    editCommentNotification(
      id: $id,
      commentNotification: $commentNotification
    ) {
      id
    }
  }
`

export const editShareNotificationQuery=gql`
  mutation ($id: ID!, $shareNotification: Boolean!) {
    editShareNotification(
      id: $id,
      shareNotification: $shareNotification
    ) {
      id
    }
  }
`

export const editProfileBioQuery=gql`
  mutation ($id: ID!, $profileBio: String!) {
    editProfileBio(
      id: $id,
      profileBio: $profileBio
    ) {
      id
    }
  }
`

export const submitPostQuery=gql`
  mutation ($user: ID!, $postType: String!, $privacy: String!, $imageFilePath: String!, $text: String!) {
    addPost(
      user: $user,
      postType: $postType,
      privacy: $privacy,
      imageFilePath: $imageFilePath,
      text: $text,
    ) {
      id
    }
  }
`

export const UPLOAD_FILE=gql`
  mutation uploadFile($file: Upload!) {
    uploadFile (
      file: $file
    ) {
      url
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
        settings {
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
          settings {
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