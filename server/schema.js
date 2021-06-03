const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user.js')

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType,
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

// Temporary Database
let users = [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      email: "admin@gmail.com",
      accountType: "Personal",
      givenName: "Ad",
      familyName: "Min",
      avatarPath: 'http://localhost:4000/images/nerddog.jpg',
      profilePicturePath: "",
      posts: ["1"],
      savedPosts: [],
      friends: ["3"],
      blockedUsers: ["2"],
      chat: [],
      notifications: [],
      online: false,
      registeredDate: "Some Date",
      profileBio: "I am the admin",
      playgrouops: [],
      pets: [],
      familyNameFirst: false,
      defaultPrivacy: true,
      likeNotification: true,
      commentNotification: true,
      shareNotification: true
    },
    {
      id: "2",
      username: "Pet Social",
      password: "admin123",
      accountType: "Business",
      email: "petsocial@gmail.com",
      givenName: "Pet",
      familyName: "Social",
      avatarPath: 'http://localhost:4000/images/cute-dog.jpg',
      profilePicturePath: "",
      posts: [],
      savedPosts: [],
      friends: [],
      blockedUsers: [],
      chat: [],
      notifications: [],
      online: false,
      registeredDate: "Some Date",
      profileBio: "Profile Bio",
      playgrouops: [],
      pets: [],
      familyNameFirst: false,
      defaultPrivacy: true,
      likeNotification: true,
      commentNotification: true,
      shareNotification: true
    },
    {
      id: "3",
      username: "bryanwhl",
      password: "admin123",
      accountType: "Personal",
      email: "bryanwhl@gmail.com",
      givenName: "Bryan",
      familyName: "Wong",
      avatarPath: 'http://localhost:4000/images/jaryl.jpg',
      profilePicturePath: "",
      posts: [],
      savedPosts: [],
      friends: [],
      blockedUsers: [],
      chat: [],
      notifications: [],
      online: false,
      registeredDate: "Some Date",
      profileBio: "Profile Bio",
      playgrouops: [],
      pets: [],
      familyNameFirst: false,
      defaultPrivacy: true,
      likeNotification: true,
      commentNotification: true,
      shareNotification: true
    },
    {
        id: "4",
        username: "matthewtan",
        password: "admin123",
        accountType: "Personal",
        givenName: "Matthew",
        familyName: "Tan",
        email: "matthewtan@gmail.com",
        avatarPath: 'http://localhost:4000/images/coco.png',
        profilePicturePath: "",
        posts: [],
        savedPosts: [],
        friends: [],
        blockedUsers: [],
        chat: [],
        notifications: [],
        online: false,
        registeredDate: "Some Date",
        profileBio: "Profile Bio",
        playgrouops: [],
        pets: [],
        familyNameFirst: false,
        defaultPrivacy: true,
        likeNotification: true,
        commentNotification: true,
        shareNotification: true
    },
]

let posts = [
    {
        id: "1",
        user: {
            id: "4",
            username: "matthewtan",
            accountType: "Personal",
            givenName: "Matthew",
            familyName: "Tan",
            avatarPath: 'http://localhost:4000/images/coco.png',
            familyNameFirst: false,
        },
        date: dateScalar.parseValue("22 May 2021"),
        postType: "Image",
        privacy: "Public",
        imageFilePath: "http://localhost:4000/images/coco2.jpg",
        videoFilePath: "",
        location: "",
        text: "Here's coco sunbathing at the balcony. Good way to spend her time during the lockdown!",
        comments: [
        {
            user: {
                givenName: "Ethan",
                familyName: "Lee",
                familyNameFirst: false,
                avatarPath: "http://localhost:4000/images/husky.jpg",
            },
            text: "SO CUTEEEE",
            isEdited: false,
        }],
        isEdited: false
    },
    {
        id: "2",
        user: {
            id: "3",
            username: "bryanwhl",
            accountType: "Personal",
            givenName: "Bryan",
            familyName: "Wong",
            avatarPath: 'http://localhost:4000/images/cute-dog.jpg',
            familyNameFirst: false,
        },
        date: dateScalar.parseValue("21 May 2021"),
        postType: "Image",
        privacy: "Public",
        imageFilePath: "http://localhost:4000/images/jaryl.jpg",
        videoFilePath: "",
        location: "",
        text: "Botanic Gardens: Best place to bring Jaryl to for a day of entertainment",
        comments: [
        {
            user: {
                givenName: "Anderson",
                familyName: "Tang",
                familyNameFirst: false,
                avatarPath: "http://localhost:4000/images/dogprofilepic.jpg",
            },
            text: "Let's go together some day with my Corgi!",
            isEdited: false,
        }],
        isEdited: false
    },
    {
        id: "3",
        user: {
            id: "3",
            username: "bryanwhl",
            accountType: "Personal",
            givenName: "Bryan",
            familyName: "Wong",
            avatarPath: 'http://localhost:4000/images/cute-dog.jpg',
            familyNameFirst: false,
        },
        date: dateScalar.parseValue("21 May 2021"),
        postType: "Image",
        privacy: "Public",
        imageFilePath: "http://localhost:4000/images/eastcoast.jpg",
        videoFilePath: "",
        location: "",
        text: "Took my dogs out to East Coast Park for a walk today. They seem to enjoy the sea breeze a lot!",
        comments: [
          {
            user: {
                givenName: "Gregg",
                familyName: "Tang",
                familyNameFirst: false,
                avatarPath: "http://localhost:4000/images/bulldog.jpg",
            },
            text: "Yooo I was there about an hour ago with my Bulldog! Didn't know you frequent there with your dogs too. We should form a playgroup there soon.",
            isEdited: false
          },
          {
            user: {
                givenName: "Patrick",
                familyName: "Wong",
                familyNameFirst: false,
                avatarPath: "http://localhost:4000/images/cutie.jpg",
            },
            text: "Your dogs seem to enjoy the sea breeze hahaha",
            isEdited: false
          },
          {
            user: {
                givenName: "Brendan",
                familyName: "Lim",
                familyNameFirst: false,
                avatarPath: "http://localhost:4000/images/pug.jpg",
            },
            text: "Awww did you really get a stroller for them too?",
            isEdited: false
          }],
        isEdited: false,
    }
]

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
        blockedUser: [User]!
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
        meetingLocation: String!
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
        }
    },
    Query: {
        allUsers: () => users,
        getPosts: () => posts,
        findUser: (root, args) =>
            users.find(user => user.id === args.id)
    },
    Mutation: {
        addUser: (root, args) => {
            const newUser = {
                ...args,
                id: String(users.length + 1),
                avatarPath: "",
                profilePicturePath: "",
                posts: [],
                savedPosts: [],
                friends: [],
                blockedUsers: [],
                chats: [],
                notifications: [],
                online: false,
                registeredDate: "Current Date", //Need Change
                profileBio: "",
                playgroups: [],
                pets: [],
                familyNameFirst: false, 
                defaultPrivacy: "Hello",
                likeNotification: true,
                commentNotification: true,
                shareNotification: true
            }
            users = users.concat(newUser)
            return newUser
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
            const userToDelete = users.find(user => user.id === args.id)
            if (!userToDelete) {
                return null
            }
            users = users.filter(user => user.id !== args.id)
            return userToDelete
        },
        editPassword: (root, args) => {
            const userToUpdate = users.find(user => user.id === args.id)
            if (!userToUpdate) {
                return null
            }
            const updatedUser = { ...userToUpdate, password: args.password }
            users = users.map(user => user.id === args.id ? updatedUser: user)
            return updatedUser
        },
        editFamilyNameFirst: (root, args) => { //Maybe can simplify all settings edits to one function that takes in parameter of which field to edit
            const userToUpdate = users.find(user => user.id === args.id)
            if (!userToUpdate) {
                return null
            }
            const updatedUser = { ...userToUpdate, familyNameFirst: args.familyNameFirst }
            users = users.map(user => user.id === args.id ? updatedUser: user)
            return updatedUser
        },
        editLikeNotification: (root, args) => {
            const userToUpdate = users.find(user => user.id === args.id)
            if (!userToUpdate) {
                return null
            }
            const updatedUser = { ...userToUpdate, likeNotification: args.likeNotification }
            users = users.map(user => user.id === args.id ? updatedUser: user)
            return updatedUser
        },
        editCommentNotification: (root, args) => {
            const userToUpdate = users.find(user => user.id === args.id)
            if (!userToUpdate) {
                return null
            }
            const updatedUser = { ...userToUpdate, commentNotification: args.commentNotification }
            users = users.map(user => user.id === args.id ? updatedUser: user)
            return updatedUser
        },
        editShareNotification: (root, args) => {
            const userToUpdate = users.find(user => user.id === args.id)
            if (!userToUpdate) {
                return null
            }
            const updatedUser = { ...userToUpdate, shareNotification: args.shareNotification }
            users = users.map(user => user.id === args.id ? updatedUser: user)
            return updatedUser
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