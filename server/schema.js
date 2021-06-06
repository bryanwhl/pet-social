const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user.js')
const Post = require('./models/post.js')
const Comment = require('./models/comment.js')
require('dotenv').config({path: `${__dirname}/.env`});

const {
    GraphQLScalarType,
    Kind
  } = require('graphql')

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value) {
      return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
      }
      return null; // Invalid hard-coded value (not an integer)
    },
});

const typeDefs = gql`
    scalar Date

    type User {
        id: ID!
        username: String!
        password: String!
        email: String!
        accountType: String!
        name: Name!
        avatarPath: String!
        profilePicturePath: String!
        posts: [Post]!
        savedPosts: [Post]!
        friends: [User]!
        blockedUsers: [User]!
        chats: [Chat]!
        notifications: [Notification]!
        online: Boolean!
        registeredDate: Date!
        profileBio: String
        playgroups: [Playgroup]!
        pets: [Pet]!
        settings: Settings!
    }
    type Name {
        givenName: String!
        familyName: String!
    }
    type NameInput {
        givenName: String!
        familyName: String!
    }
    type Settings {
        familyNameFirst: Boolean!
        defaultPrivacy: String!
        likeNotification: Boolean!
        commentNotification: Boolean!
        shareNotification: Boolean!
    }
    type Post {
        id: ID!
        user: User!
        date: Date!
        postType: String!
        privacy: String!
        imageFilePath: String
        videoFilePath: String
        tagged: [Pet]
        location: String
        text: String!
        likedBy: [User]
        comments: [Comment]!
        isEdited: Boolean!
    }
    type Comment {
        id: ID!
        user: User!
        date: Date!
        text: String!
        likedBy: [User]
        isEdited: Boolean!
        replies: [Comment]
    }
    type Notification {
        id: ID!
        fromUser: User!
        date: Date!
        notificationType: String!
        post: Post
        friendRequest: FriendRequest
        comment: Comment
    }
    type Chat {
        id: ID!
        users: [User!]!
        messages: [Message]!
    }
    type Message {
        id: ID!
        user: User!
        date: Date!
        isEdited: Boolean!
        isSeen: Boolean!
    }
    type Pet {
        id: ID!
        name: String!
        owners: [User!]!
        dateOfBirth: Date!
        gender: String!
        breed: String!
        picturePath: String
    }
    type Playgroup {
        id: ID!
        name: String!
        description: String
        playgroupAdmin: [User!]!
        members: [User!]!
        meetingDates: [Date]!
        meetingLocation: [Float]!
        dateCreated: Date!
        playgroupChat: Chat!
    }
    type FriendRequest {
        id: ID!
        fromUser: User!
        toUser: User!
        date: Date!
    }
    type Query {
        allUsers: [User]!
        findUser(id: ID): User
        getPosts: [Post]!
    }
    type Mutation {
        addUser(
            username: String!
            password: String!
            email: String!
            accountType: String!
            givenName: String!
            familyName: String!
        ): User
        deleteUser(
            id: ID!
        ): User
        editPassword(
            id: ID!
            password: String!
        ): User
        editFamilyNameFirst(
            id: ID!
            familyNameFirst: Boolean!
        ): User
        editLikeNotification(
            id: ID!
            likeNotification: Boolean!
        ): User
        editCommentNotification(
            id: ID!
            commentNotification: Boolean!
        ): User
        editShareNotification(
            id: ID!
            shareNotification: Boolean!
        ): User
    }

`

const resolvers = {
    Date: dateScalar,
    User: {
        name: (root) => {
            return {
                givenName: root.givenName,
                familyName: root.familyName
            }
        },
        settings: (root) => {
            return {
                familyNameFirst: root.familyNameFirst,
                defaultPrivacy: root.defaultPrivacy,
                likeNotification: root.likeNotification,
                commentNotification: root.commentNotification,
                shareNotification: root.shareNotification
            }
        },
        posts: async (root) => {
            return (await root.populate('posts').execPopulate()).posts
        },
        savedPosts: async (root) => {
            return (await root.populate('savedPosts').execPopulate()).savedPosts
        },
        friends: async (root) => {
            return (await root.populate('friends').execPopulate()).friends
        },
        blockedUsers: async (root) => {
            return (await root.populate('blockedUsers').execPopulate()).blockedUsers
        },
        chats: async (root) => {
            return (await root.populate('chats').execPopulate()).chats
        },
        notifications: async (root) => {
            return (await root.populate('notifications').execPopulate()).notifications
        },
        playgroups: async (root) => {
            return (await root.populate('playgroups').execPopulate()).playgroups
        },
        pets: async (root) => {
            return (await root.populate('pets').execPopulate()).pets
        }
    },
    Comment: {
        user: (root) => {
            return User.findById(root.user)
        },
        likedBy: async (root) => {
            return (await root.populate('likedBy').execPopulate()).likedBy
        },
        replies: async (root) => {
            return (await root.populate('replies').execPopulate()).replies
        }
    },
    Post: {
        user: (root) => {
            return User.findById(root.user)
        },
        comments: async (root) => {
            return (await root.populate('comments').execPopulate()).comments
        },
        likedBy: async (root) => {
            return (await root.populate('likedBy').execPopulate()).likedBy
        },
        tagged: async (root) => {
            return (await root.populate('tagged').execPopulate()).tagged
        },
    },
    Query: {
        allUsers: () => User.find({}),
        getPosts: () => Post.find({}),
        findUser: (root, args) => User.findById(args.id)
    },
    Mutation: {
        addUser: (root, args) => {
            const user = new User({
                ...args,
                avatarPath: "",
                profilePicturePath: "",
                posts: [],
                savedPosts: [],
                friends: [],
                blockedUsers: [],
                chats: [],
                notifications: [],
                online: false,
                registeredDate: Date(),
                profileBio: "",
                playgroups: [],
                pets: [],
                familyNameFirst: false, 
                defaultPrivacy: true,
                likeNotification: true,
                commentNotification: true,
                shareNotification: true
            })
            return user.save()
        },
        // addPost: (root, args) => {
        //     const newPost = {
        //         ...args,
        //         id: String(users.length + 1),
        //         avatarPath: "",
        //         profilePicturePath: "",
        //         posts: [],
        //         savedPosts: [],
        //         friends: [],
        //         blockedUsers: [],
        //         chats: [],
        //         notifications: [],
        //         online: false,
        //         registeredDate: "Current Date", //Need Change
        //         profileBio: "",
        //         playgroups: [],
        //         pets: [],
        //         familyNameFirst: false, 
        //         defaultPrivacy: "Hello"
        //     }
        //     posts = posts.concat(newPost)
        //     return newPost
        // },
        deleteUser: (root, args) => {
            User.findByIdAndDelete(args.id, function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Deleted : ", docs);
                }
            })
        },
        editPassword: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change
            if (!userToUpdate) {
                return null
            }
            userToUpdate.password = args.password
            await userToUpdate.save();
        },
        editFamilyNameFirst: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change
            if (!userToUpdate) {
                return null
            }
            userToUpdate.familyNameFirst = args.familyNameFirst
            await userToUpdate.save();
        },
        editLikeNotification: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change
            if (!userToUpdate) {
                return null
            }
            userToUpdate.likeNotification = args.likeNotification
            await userToUpdate.save();
        },
        editCommentNotification: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change
            if (!userToUpdate) {
                return null
            }
            userToUpdate.commentNotification = args.commentNotification
            await userToUpdate.save();
        },
        editShareNotification: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change
            if (!userToUpdate) {
                return null
            }
            userToUpdate.shareNotification = args.shareNotification
            await userToUpdate.save();
        }
    }
}

const app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.applyMiddleware({app})

app.use(express.static('server/public'))

app.listen({port: 4000}, () => {
    console.log(`Server ready at http://localhost:4000`)
})

// app.listen().then(({ url, subscriptionsUrl }) => {
//     console.log(`Server ready at ${subscriptionsUrl}`)
// })