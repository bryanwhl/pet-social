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

export const allUsernameQuery=gql`
  query {
    allUsers {
      username
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
      id
      username
      name {
        givenName
        familyName
      }
      settings {
        familyNameFirst
      }
      avatarPath
    }
    blockedUsers {
      id
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
    sentFriendRequests {
      id
      date
      toUser {
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
    }
    receivedFriendRequests {
      id
      date
      fromUser {
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

export const getNotificationsQuery=gql`
 query ($id: ID!) {
   getNotifications (id: $id) {
    id
    fromUser {
      id
      username
      name {
        givenName
        familyName
      }
      settings {
        familyNameFirst
      }
      avatarPath
    }
    toUser {
      id
    }
    date
    notificationType
    post {
        id
    }
    friendRequest {
        id
    }
    comment {
      id
    }
   }
 }
`

export const getUserByIdQuery=gql`
  query ($id: ID!) {
    findUser(id: $id) {
      id
    email
    profileBio
    name {
        givenName
        familyName
    }
    friends {
      id
      username
      name {
        givenName
        familyName
      }
      settings {
        familyNameFirst
      }
      avatarPath
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
      likedBy {
        id
      }
      date
      postType
      privacy
      imageFilePath
      videoFilePath
      location
      text
      comments {
        id
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
        date
        likedBy {
          id
        }
        text
      }
      isEdited
    }
  }
`

export const getUserProfileQuery=gql`
  query ($username: String!) {
    getUserProfile(username: $username) {
      username
      email
      profileBio
      name {
          givenName
          familyName
      }
      friends {
        id
        username
        name {
          givenName
          familyName
        }
        settings {
          familyNameFirst
        }
        avatarPath
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
      }
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
export const addPetQuery=gql`
  mutation ($name: String!, $owner: ID!, $dateOfBirth: Date!, $gender: String!, $breed: String!, $picturePath: String!) {
    addPet(
      name: $name,
      owner: $owner,
      dateOfBirth: $dateOfBirth,
      gender: $gender,
      breed: $breed,
      picturePath: $picturePath,
    ) {
      id
      pets {
        id
        name
        picturePath
      }
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

export const sendFriendRequestQuery=gql`
  mutation ($to: ID!, $from: ID!) {
    sendFriendRequest(
      to: $to,
      from: $from
    ) {
      id
    }
  }
`

export const retractFriendRequestQuery=gql`
  mutation ($to: ID!, $from: ID!) {
    retractFriendRequest(
      to: $to,
      from: $from
    ) {
      id
    }
  }
`

export const acceptFriendRequestQuery=gql`
  mutation ($to: ID!, $from: ID!) {
    acceptFriendRequest(
      to: $to,
      from: $from
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

export const deleteFriendQuery=gql`
  mutation ($id: ID!, $friend: ID!) {
    deleteFriend(
      id: $id,
      friend: $friend
    ) {
      id
      friends {
        id
        username
        name {
          givenName
          familyName
        }
        settings {
          familyNameFirst
        }
        avatarPath
      }
    }
  }
`

export const deleteOwnerQuery=gql`
  mutation ($owner: ID!, $pet: ID!) {
    deleteOwner(
      owner: $owner,
      pet: $pet
    ) {
      id
      pets {
        id
        name
        picturePath
      }
    }
  }
`

export const deletePetQuery=gql`
  mutation ($id: ID!, $user: ID!) {
    deletePet(
      id: $id,
      user: $user
    ) {
      id
      pets {
        id
        name
        picturePath
      }
    }
  }
`

export const deleteNotificationQuery=gql`
  mutation ($id: ID!) {
    deleteNotification(
      id: $id
    ) {
      id
    }
  }
`

export const deleteCommentQuery=gql`
  mutation ($id: ID!, $post: ID!) {
    deleteComment(
      id: $id,
      post: $post
    ) {
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
      likedBy {
        id
      }
      date
      postType
      privacy
      imageFilePath
      videoFilePath
      location
      text
      comments {
        id
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
        date
        likedBy {
          id
        }
        text
      }
      isEdited
    }
  }
`

export const deletePostQuery=gql`
  mutation ($id: ID!, $userID: ID!) {
    deletePost(
      id: $id,
      userID: $userID
    ) {
      id
    }
  }
`


export const likeCommentQuery=gql`
  mutation ($id: ID!, $user: ID!) {
    editCommentLike(
      id: $id,
      user: $user
    ) {
      id
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
      date
      likedBy {
        id
      }
      text
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

export const likePostQuery=gql`
  mutation ($id: ID!, $userID: ID!) {
    editPostLike(
      id: $id,
      userID: $userID
    ) {
      id
    }
  }
`

export const savePostQuery=gql`
  mutation ($id: ID!, $postID: ID!) {
    editPostSave(
      id: $id,
      postID: $postID
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

export const editPostCaptionQuery=gql`
  mutation ($id: ID!, $text: String!) {
    editPostCaption(
      id: $id,
      text: $text
    ) {
      id
    }
  }
`

export const editAvatarQuery=gql`
  mutation ($id: ID!, $avatarPath: String!) {
    editAvatar(
      id: $id,
      avatarPath: $avatarPath
    ) {
      id
    }
  }
`

export const editPetPictureQuery=gql`
  mutation ($id: ID!, $picturePath: String!) {
    editPetPicture(
      id: $id,
      picturePath: $picturePath
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

export const submitCommentQuery=gql`
  mutation ($post: ID!, $user: ID!, $text: String!) {
    addComment(
      post: $post,
      user: $user,
      text: $text,
    ) {
      id
    },
  }
`

export const submitPlaygroupQuery=gql`
  mutation ($playgroupAdmin: ID!, $name: String!, $description: String!, $meetingLat: Float!, $meetingLng: Float!, $meetingDate: Date!) {
    addPlaygroup(
      playgroupAdmin: $playgroupAdmin,
      name: $name,
      description: $description,
      meetingLat: $meetingLat,
      meetingLng: $meetingLng,
      meetingDate: $meetingDate,
    ) {
      id
    }
  }
`

export const deletePlaygroupQuery=gql`
  mutation ($id: ID!) {
    deletePlaygroup(
      id: $id,
    ) {
      id
    }
  }
`

export const joinPlaygroupQuery=gql`
  mutation ($id: ID!, $userID: ID!) {
    joinPlaygroup(
      id: $id,
      userID: $userID
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
      likedBy {
        id
      }
      comments {
        id
        user {
          id
          name {
            givenName
            familyName
          }
          settings {
            familyNameFirst
          }
          avatarPath
        }
        date
        likedBy {
          id
        }
        text
      }
      isEdited
    }
  }
`

export const getPlaygroupsQuery=gql`
  query {
    getPlaygroup {
      id
      description
      name
      meetingLat
      meetingLng
      meetingDate
      playgroupAdmin {
        id
        username
      }
      members {
        id
        username
      }
      dateCreated
    }
  }
`