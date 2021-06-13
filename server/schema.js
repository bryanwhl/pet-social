const { ApolloServer, gql, buildSchemaFromTypeDefinitions, UserInputError, AuthenticationError } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/user.js')
const Post = require('./models/post.js')
const Comment = require('./models/comment.js')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
//const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
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

function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const typeDefs = gql`
    scalar Date
    # scalar Upload

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
    type Token {
        value: String!
    }
    type File {
        url: String
    }
    type Query {
        allUsers: [User]!
        findUser(id: ID): User
        me: User
        findPost(id :ID): Post
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
        addPost (
            user: ID!
            imageFilePath: String
            text: String!
            postType: String!
            privacy: String!
        ): Post
        deleteUser(
            id: ID!
            password: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
        editEmail(
            id: ID!
            email: String!
        ): User
        editPassword(
            id: ID!
            password: String!
            newPassword: String!
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
        editProfileBio(
            id: ID!
            profileBio: String!
        ): User
        uploadFile(
            file: Upload!
        ): File!
    }

`

const resolvers = {
    Date: dateScalar,
//    Upload: GraphQLUpload,
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
        me: (root, args, context) => {return context.currentUser},
        findUser: (root, args) => User.findById(args.id),
        findPost: (root, args) => Post.findById(args.id),
    },
    Mutation: {
        addUser: async (root, args) => {
            const saltRounds = 10
            const user = new User({
                ...args,
                password: await bcrypt.hash(args.password, saltRounds),
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
        uploadFile: async (parent, {file}) => {
            console.log("reached");
            const { createReadStream, filename } = await file;

            console.log(filename);
            console.log("here")
            const { ext } = path.parse(filename)
            const randomName = generateRandomString(12) + ext
            console.log(randomName);
            const pathName = path.join(__dirname, `/public/images/${randomName}`)

            const storeUpload = async ({ stream }) => {
                return new Promise( (resolve, reject) =>
                    stream.pipe(fs.createWriteStream(pathName)).on('finish', () => {
                        resolve();
                    })
                );
            };

            const stream = createReadStream()

            await storeUpload({stream});

            console.log(`http://localhost:4000/images/${randomName}`)

            return {
                url: `http://localhost:4000/images/${randomName}`,
            }
        },
        addPost: async (root, args) => {
            console.log(args.imageFilePath);
            console.log("reached here")
            const newPost = new Post ({
                ...args,
                videoFilePath: "",
                tagged: [],
                likedBy: [],
                comments: [],
                isEdited: false,
                date: Date(),
                location: "",
            })
            const user = await User.findById( args.user ).exec();
            if (!user) {
                return null
            }
            console.log(user.id);
            const savePost = await newPost.save();
            console.log(savePost);
            user.posts = user.posts.concat(savePost.id);
            user.save();
            console.log(user.posts);
            return savePost;
        },
        deleteUser: async (root, args) => {
            const user = await User.findById( args.id ).exec();
            if (!user) {
                return null
            }

            const passwordCorrect = await bcrypt.compare(args.password, user.password)

            if ( !passwordCorrect ) {
                throw new UserInputError("Password is incorrect")
            }

            User.findByIdAndDelete(args.id, function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Deleted : ", docs);
                }
            })
        },
        login: async (root, args) => {
            if ( args.username === "" ) {
                throw new UserInputError("Username cannot be empty")
            } else if ( args.password === "" ) {
                throw new UserInputError("Password cannot be empty")
            }

            const user = await User.findOne({ username: args.username })
            
            if ( !user ) {
                throw new UserInputError("Username does not exist")
            }
            
            const passwordCorrect = await bcrypt.compare(args.password, user.password)

            if ( !passwordCorrect ) {
                throw new UserInputError("Password is incorrect")
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
        editPassword: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change to use context for authentication
            if (!userToUpdate) {
                return null
            }

            const passwordCorrect = await bcrypt.compare(args.password, userToUpdate.password)

            if ( !passwordCorrect ) {
                throw new UserInputError("Password is incorrect")
            }

            userToUpdate.password = await bcrypt.hash(args.newPassword, 10)
            await userToUpdate.save();
        },
        editEmail: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change to use context for authentication
            if (!userToUpdate) {
                return null
            }
            userToUpdate.email = args.email
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
        },
        editProfileBio: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change
            if (!userToUpdate) {
                return null
            }
            userToUpdate.profileBio = args.profileBio
            await userToUpdate.save();
        },
    }
}

const app = express()

const server = new ApolloServer({
    //uploads: false,
    typeDefs,
    resolvers,
    
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7), process.env.JWT_SECRET
          )
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
    }
})

server.applyMiddleware({app})

app.use(express.static('server/public'))
app.use(cors())

app.listen({port: 4000}, () => {
    console.log(`Server ready at http://localhost:4000`)
})

// app.listen().then(({ url, subscriptionsUrl }) => {
//     console.log(`Server ready at ${subscriptionsUrl}`)
// })