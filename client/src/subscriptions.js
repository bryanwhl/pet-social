import { gql  } from '@apollo/client'

export const POST_LIKED = gql`
  subscription {
    notification {
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
      date
      notificationType
      post {
          id
      }
      friendRequest {
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
      comment {
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
  }
`