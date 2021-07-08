const { ApolloServer, gql, buildSchemaFromTypeDefinitions, UserInputError, AuthenticationError } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/user.js')
const Post = require('./models/post.js')
const Comment = require('./models/comment.js')
const Playgroup = require('./models/playgroup.js')
const FriendRequest = require('./models/friendRequest.js')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const Pet = require('./models/pet.js')
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
        posts: [Post]!
        savedPosts: [Post]!
        friends: [User]!
        blockedUsers: [User]!
        chats: [Chat]!
        sentFriendRequests: [FriendRequest]!
        receivedFriendRequests: [FriendRequest]!
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
        likedBy: [User]!
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
        description: String!
        playgroupAdmin: User!
        members: [User]
        meetingDate: Date!
        meetingLat: Float!
        meetingLng: Float!
        dateCreated: Date!
        playgroupChat: Chat
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
        findComment(id: ID!): Comment
        findPet(id: ID!): Pet
        getPlaygroup: [Playgroup]!
    }
    type Mutation {
        addUser(
            username: String!
            password: String!
            confirmPassword: String!
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
        addPlaygroup (
            playgroupAdmin: ID!
            name: String!
            description: String!
            meetingLat: Float!
            meetingLng: Float!
            meetingDate: Date!
        ): Playgroup
        addComment (
            user: ID!
            text: String!
            post: ID!
        ): Post
        deletePlaygroup (
            id: ID!
        ): Playgroup
        addPet(
            name: String!
            owner: ID!
            dateOfBirth: Date!
            gender: String!
            breed: String!
            picturePath: String
        ): User
        addPetOwner(
            id: ID!
            username: String!
        ): User
        deleteUser(
            id: ID!
            password: String!
        ): User
        deleteFriend(
            id: ID!
            friend: ID!
        ): User
        deleteOwner(
            owner: ID!
            pet: ID!
        ): User
        deletePet(
            id: ID!
            user: ID!
        ): User
        deleteComment(
            id: ID!
            post: ID!
        ): Post
        login(
            username: String!
            password: String!
        ): Token
        sendFriendRequest(
            from: ID!
            to: ID!
        ): FriendRequest
        retractFriendRequest(
            from: ID!
            to: ID!
        ): FriendRequest
        acceptFriendRequest(
            from: ID!
            to: ID!
        ): FriendRequest
        resetPassword(
            email: String!
            password: String!
            confirmPassword: String!
        ): User
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
        editAvatar(
            id: ID!
            avatarPath: String!
        ): User
        editPetPicture(
            id: ID!
            picturePath: String!
        ): Pet
        uploadFile(
            file: Upload!
        ): File!
        editPostLike(
            id: ID!,
            userID: ID!
        ): Post
        editPostSave(
            id: ID!,
            postID: ID!
        ): User
        editCommentLike(
            id: ID!,
            user: ID!
        ): Comment
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
        sentFriendRequests: async (root) => {
            return (await root.populate('sentFriendRequests').execPopulate()).sentFriendRequests
        },
        receivedFriendRequests: async (root) => {
            return (await root.populate('receivedFriendRequests').execPopulate()).receivedFriendRequests
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
            return User.findById(root.user).exec()
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
    Playgroup: {
        playgroupAdmin: (root) => {
            return User.findById(root.playgroupAdmin)
        },
        members: async (root) => {
            return (await root.populate('members').execPopulate()).members
        },
    },
    Pet: {
        owners: async (root) => {
            return (await root.populate('owners').execPopulate()).owners
        }
    },
    FriendRequest: {
        fromUser: async (root) => {
            return User.findById(root.fromUser).exec()
        },
        toUser: async (root) => {
            return User.findById(root.toUser).exec()
        },
    },
    Query: {
        allUsers: () => User.find({}),
        getPosts: () => Post.find({}),
        me: (root, args, context) => {return context.currentUser},
        findUser: (root, args) => User.findById(args.id),
        findPost: (root, args) => Post.findById(args.id),
        findComment: (root, args) => Comment.findById(args.id),
        findPet: (root, args) => Pet.findById(args.id),
        getPlaygroup: () => Playgroup.find({})
    },
    Mutation: {
        addUser: async (root, args) => {
            if ( args.username === "" ) {
                throw new UserInputError("Username cannot be empty")
            } else if ( args.password !== args.confirmPassword ) {
                throw new UserInputError("Passwords do not match")
            } else if (!args.email.includes('@') || !args.email.includes('.')) {
                throw new UserInputError("Invalid Email")
            }

            const checkEmail = await User.findOne({ email: args.email })

            if ( checkEmail ) {
                throw new UserInputError("Email already exists")
            }

            const user = await User.findOne({ username: args.username })
            
            if ( user ) {
                throw new UserInputError("Username already exists")
            }

            const saltRounds = 10
            const newUser = new User({
                ...args,
                password: await bcrypt.hash(args.password, saltRounds),
                avatarPath: "",
                posts: [],
                savedPosts: [],
                friends: [],
                blockedUsers: [],
                chats: [],
                sentFriendRequests: [],
                receivedFriendRequests: [],
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
            delete newUser.confirmPassword
            return newUser.save()
        },
        addPet: async (root, args) => {
            if (args.dateOfBirth.getTime() > new Date().getTime()) {
                throw new UserInputError("Date of Birth cannot be after today")
            }

            const owners = [args.owner]
            console.log(owners)
            const newPet = new Pet({
                ...args,
                owners: owners
            })
            delete newPet.owner

            const addedPet = await newPet.save()

            const owner = await User.findById( args.owner ).exec();
            if (!owner) {
                return null
            }

            owner.pets = owner.pets.concat(addedPet._id)

            await owner.save()

            return owner
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
            const savePost = await newPost.save();
            user.posts = user.posts.concat(savePost.id);
            user.save();
            return savePost;
        },
        addPlaygroup: async (root, args) => {
            const newPlaygroup = new Playgroup ({
                ...args,
                members: [],
                dateCreated: Date(),
            });
            const savePlaygroup = await newPlaygroup.save();
            return savePlaygroup;
        },
        addComment: async (root, args) => {
            const newComment = new Comment ({
                user: args.user,
                text: args.text,
                isEdited: false,
                date: Date(),
                likedBy: [],
                replies: [],
            });
            const post = await Post.findById( args.post ).exec();
            if (!post) {
                return null;
            }
            const saveComment = await newComment.save();
            post.comments = post.comments.concat(saveComment.id);
            post.save();
            return post;
        },
        deletePlaygroup: async (root, args) => {
            Playgroup.findByIdAndDelete(args.id, function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Deleted : ", docs);
                }
            })
        },
        deleteComment: async (root, args) => {
            Comment.findByIdAndDelete(args.id, function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Deleted : ", docs);
                }
            })
            Post.updateOne({_id: args.post}, {$pull: {comments: args.id}}).exec()
            post = await Post.findById(args.post).exec()

            return post
        },
        sendFriendRequest: async (root, args) => {
            const existingFrom = await FriendRequest.findOne({ fromUser: args.from, toUser: args.to}).exec()
            const existingTo = await FriendRequest.findOne({ fromUser: args.to, toUser: args.from}).exec()
            if (existingFrom || existingTo) {
                throw new UserInputError("Friend Request between users already exist")
            }

            const newFriendRequest = new FriendRequest ({
                fromUser: args.from,
                toUser: args.to,
                date: Date(),
            })
            const fromUser = await User.findById( args.from ).exec();
            if (!fromUser) {
                return null
            }
            const toUser = await User.findById( args.to ).exec();
            if (!toUser) {
                return null
            }
            const saveFriendRequest = await newFriendRequest.save();
            fromUser.sentFriendRequests = fromUser.sentFriendRequests.concat(saveFriendRequest.id);
            await fromUser.save();
            toUser.receivedFriendRequests = toUser.receivedFriendRequests.concat(saveFriendRequest.id);
            await toUser.save();
            return saveFriendRequest;
        },
        retractFriendRequest: async (root, args) => {
            const friendRequest = await FriendRequest.findOne({ fromUser: args.from, toUser: args.to}).exec()
            if (!friendRequest) {
                throw new UserInputError("Friend Request already accepted or retracted")
            }

            User.updateOne({_id: friendRequest.fromUser}, {$pull: {sentFriendRequests: friendRequest.id}}).exec()
            User.updateOne({_id: friendRequest.toUser}, {$pull: {receivedFriendRequests: friendRequest.id}}).exec()
            await FriendRequest.deleteOne({_id: friendRequest.id}).exec()
            return friendRequest;
        },
        acceptFriendRequest: async (root, args) => {
            const friendRequest = await FriendRequest.findOne({ fromUser: args.from, toUser: args.to}).exec()
            if (!friendRequest) {
                throw new UserInputError("Friend Request already accepted or retracted")
            }

            User.updateOne({_id: friendRequest.fromUser}, {$addToSet: {friends: friendRequest.toUser}}).exec()
            User.updateOne({_id: friendRequest.toUser}, {$addToSet: {friends: friendRequest.fromUser}}).exec()
            User.updateOne({_id: friendRequest.fromUser}, {$pull: {sentFriendRequests: friendRequest.id}}).exec()
            User.updateOne({_id: friendRequest.toUser}, {$pull: {receivedFriendRequests: friendRequest.id}}).exec()
            await FriendRequest.deleteOne({_id: friendRequest.id}).exec()
            return friendRequest;
        },
        addPetOwner: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            
            if ( !user ) {
                throw new UserInputError("User does not exist")
            }

            const pet = await Pet.findById( args.id ).exec()

            if (pet.owners.includes(user.id)) {
                throw new UserInputError("User is already an owner")
            }

            pet.owners = pet.owners.concat(user.id)
            user.pets = user.pets.concat(args.id)

            await user.save()
            await pet.save()
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

            Pet.updateMany({}, {$pull: {owners: args.id}}).exec()
            Post.remove({user: args.id}).exec()
            Comment.remove({user: args.id}).exec()
            FriendRequest.remove({fromUser: args.id}).exec()
            User.updateMany({}, {$pull: {sentFriendRequests: {toUser: args.id}}}).exec()
            User.updateMany({}, {$pull: {receivedFriendRequests: {fromUser: args.id}}}).exec()

            User.findByIdAndDelete(args.id, function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Deleted : ", docs);
                }
            })
        },
        deleteFriend: async (root, args) => {
            const user = await User.findById( args.id ).exec();
            if (!user) {
                return null
            }
            
            const friend = await User.findById( args.friend ).exec();
            if (!friend) {
                return null
            }

            User.updateOne({_id: args.id}, {$pull: {friends: args.friend}}).exec()
            User.updateOne({_id: args.friend}, {$pull: {friends: args.id}}).exec()
            

            return user
        },
        deleteOwner: async (root, args) => {
            const owner = await User.findById( args.owner ).exec();
            if (!owner) {
                return null
            }
            
            const pet = await Pet.findById( args.pet ).exec();
            if (!pet) {
                return null
            }

            User.updateOne({_id: args.owner}, {$pull: {pets: args.pet}}).exec()
            Pet.updateOne({_id: args.pet}, {$pull: {owners: args.owner}}).exec()
            

            return owner
        },
        deletePet: async (root, args) => {
            const user = await User.findById( args.user).exec();
            const pet = await Pet.findById( args.id ).exec();
            if (!pet) {
                return null
            }


            User.updateMany({}, {$pull: {pets: args.id}}).exec()
            
            Pet.findByIdAndDelete(args.id, function (err, docs) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Deleted : ", docs);
                }
            })

            return user
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
        resetPassword: async (root, args) => {
            if (!args.email.includes('@') || !args.email.includes('.')) {
                throw new UserInputError("Invalid Email")
            } else if (args.password !== args.confirmPassword) {
                throw new UserInputError("Passwords do not match")
            }

            const user = await User.findOne({ email: args.email })
            
            if ( !user ) {
                throw new UserInputError("Email does not exist")
            }

            const passwordMatch = await bcrypt.compare(args.password, user.password)

            if ( passwordMatch ) {
                throw new UserInputError("Password same")
            }
            
            user.password = await bcrypt.hash(args.password, 10)
            await user.save();
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
            if (!args.email.includes('@') || !args.email.includes('.')) {
                throw new UserInputError("Invalid Email")
            }

            const checkEmail = await User.findOne({ email: args.email })

            if ( checkEmail ) {
                throw new UserInputError("Email already exists")
            }

            const userToUpdate = await User.findById( args.id ).exec(); //must change to use context for authentication
            if (!userToUpdate) {
                return null
            }
            userToUpdate.email = args.email
            await userToUpdate.save();
        },
        editFamilyNameFirst: async (root, args, context) => {
            const user = context.currentUser
            if (!user) {
                throw new AuthenticationError("Invalid token")
            }
            const userToUpdate = await User.findById( args.id ).exec();
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
                return null;
            }
            userToUpdate.profileBio = args.profileBio
            await userToUpdate.save();
        },
        editAvatar: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change
            if (!userToUpdate) {
                return null
            }
            userToUpdate.avatarPath = args.avatarPath
            await userToUpdate.save();
         },
        editPetPicture: async (root, args) => {
            const pet = await Pet.findById( args.id ).exec();
            if (!pet) {
                return null
            }
            pet.picturePath = args.picturePath
            await pet.save();
         },
        editPostLike: async (root, args) => {
            const postToUpdate = await Post.findById( args.id ).exec(); //must change to use context for authentication
            if (!postToUpdate) {
                return null;
            }
            if (postToUpdate.likedBy.includes(args.userID)) {
                Post.updateOne({_id: args.id}, {$pull: {likedBy: args.userID}}).exec()
            } else {
                postToUpdate.likedBy = postToUpdate.likedBy.concat(args.userID);
            }
            await postToUpdate.save();
        },
        editPostSave: async (root, args) => {
            const userToUpdate = await User.findById( args.id ).exec(); //must change
            if (!userToUpdate) {
                return null;
            }
            if (userToUpdate.savedPosts.includes(args.postID)) {
                User.updateOne({_id: args.id}, {$pull: {savedPosts: args.postID}}).exec()
            } else {
                userToUpdate.savedPosts = userToUpdate.savedPosts.concat(args.postID);
            }
            await userToUpdate.save();
        },
        editCommentLike: async (root, args) => {
            const commentToUpdate = await Comment.findById( args.id ).exec(); //must change to use context for authentication
            if (!commentToUpdate) {
                return null;
            }
            if (commentToUpdate.likedBy.includes(args.user)) {
                Comment.updateOne({_id: args.id}, {$pull: {likedBy: args.user}}).exec()
            } else {
                commentToUpdate.likedBy = commentToUpdate.likedBy.concat(args.user);
            }
            await commentToUpdate.save();
            return commentToUpdate
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
module.exports = app
