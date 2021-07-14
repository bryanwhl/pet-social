import { gql  } from '@apollo/client'

export const POST_LIKED = gql`
  subscription onPostLiked($id: ID!) {
    postLiked(id: $id) {
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

export const POST_COMMENT= gql`
  subscription onPostComment($id: ID!) {
    postComment(id: $id) {
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

export const COMMENT_LIKED= gql`
  subscription onCommentLiked($id: ID!) {
    commentLiked(id: $id) {
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

export const FRIEND_REQUEST= gql`
  subscription onFriendRequestReceived($id: ID!) {
    friendRequestReceived(id: $id) {
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
      comment {
        id
      }
    }
  }
`

export const FRIEND_REQUEST_INTERACT= gql`
  subscription onFriendRequestInteracted($id: ID!) {
    friendRequestInteracted(id: $id) {
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
  }
`

export const DELETE_FRIEND= gql`
  subscription onDeleteFriendSub($id: ID!) {
    deleteFriendSub(id: $id) {
      id
    }
  }
`

export const DELETE_NOTIF= gql`
  subscription onDeleteNotif($id: ID!) {
    deleteNotif(id: $id) {
      id
      fromUser {
        id
      }
      toUser {
        id
      }
    }
  }
`