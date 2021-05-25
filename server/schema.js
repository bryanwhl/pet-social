const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
  } = require('graphql')


// Temporary Database
const users = [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      email: "admin@gmail.com",
      accountType: "Personal",
      name: {
        givenName: "Ad",
        familyName: "Min",
      },
      avatarPath: './components/static/images/cute-dog.jpg',
      profilePicturePath: "",
      posts: ["1"],
      savedPosts: [],
      friends: ["3"],
      blockedUsers: ["2"],
      chat: [],
      notifications: [],
      online: false,
      registeredDate: "Some Date",
      profileBio: "Profile Bio",
      playgrouops: [],
      pets: [],
      otherSettings: {
        nameOrder: false,
        defaultPrivacy: true
      }
    },
    {
      id: "2",
      username: "Pet Social",
      password: "admin123",
      accountType: "Business",
      name: {
        givenName: "Pet",
        familyName: "Social",
      },
      avatarPath: './components/static/images/cute-dog.jpg'
    },
    {
      id: "3",
      username: "bryanwhl",
      password: "admin123",
      accountType: "Personal",
      name: {
        givenName: "Bryan",
        familyName: "Wong",
      },
      avatarPath: './components/static/images/doctorstrange.jpg',
    },
  ]

const posts = [
    {
        id: "1",
        userID: "3",
        date: "Date",
        postType: "Image",
        privacy: "Public",
        imageFilePath: "",
        videoFilePath: "",
        location: "Somewhere",
        text: "Over the rainbow",
        tagged: [],
        likedBy: ["2"],
        comments: [],
        isEdited: false,
    }
]

const DateType = new GraphQLObjectType({
    name: 'Date',
    fields: () => ({
        date: { type: GraphQLString } //Need change
    })
})

//Types
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    accountType: { type: GraphQLString },
    name: { type: NameType },
    avatarPath: { type: GraphQLString },
    profilePicturePath: { type: GraphQLString },
    posts: { type: new GraphQLList(PostType),
            resolve(root, args){
                return posts.filter(post => post.userID === root.id)
            } },
    savedPosts: { type: new GraphQLList(PostType),
                resolve(root, args){
                return posts.filter(post => root.savedPosts.includes(post.id))
            } },
    friends: { type: new GraphQLList(UserType),
                resolve(root, args){
                    return users.filter(user => root.friends.includes(user.id))
                } },
    blockedUsers: { type: new GraphQLList(UserType),
                    resolve(root, args){
                    return users.filter(user => root.blockedUsers.includes(user.id))
        } },
    chats: { type: new GraphQLList(ChatType) },
    notifications: { type: new GraphQLList(NotificationType) },
    online: { type: GraphQLBoolean },
    registeredDate: { type: GraphQLString }, //Need Change
    profileBio: { type: GraphQLString },
    playgroups: { type: new GraphQLList(PlaygroupType) },
    pets: { type: new GraphQLList(PetType) },
    otherSettings: { type: SettingsType },
    })
})

const NameType = new GraphQLObjectType({
    name: 'Name',
    fields: () => ({
        givenName: { type: GraphQLString },
        familyName: { type: GraphQLString },
    })
})

const SettingsType = new GraphQLObjectType({
    name: 'Settings',
    fields: () => ({
        familyNameFirst: { type: GraphQLBoolean },
        defaultPrivacy: { type: GraphQLString },
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLID },
        user: { type: UserType,
                resolve(root, args){
                    return users.find(user => user.id === root.userID)
                } },
        date: { type: DateType },
        postType: { type: GraphQLString },
        privacy: { type: GraphQLString },
        imageFilePath: { type: GraphQLString },
        videoFilePath: { type: GraphQLString },
        location: { type: GraphQLString }, //Need Change
        text: { type: GraphQLString },
        tagged: { type: new GraphQLList(PetType) },
        likedBy: { type: new GraphQLList(UserType) },
        comments: { type: new GraphQLList(CommentType) },
        isEdited: { type: GraphQLBoolean },
    })
})

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLID },
        user: { type: UserType },
        date: { type: DateType },
        text: { type: GraphQLString },
        likedBy: { type: new GraphQLList(UserType) },
        replies: { type: new GraphQLList(CommentType) },
        isEdited: { type: GraphQLBoolean },
    })
})

const NotificationType = new GraphQLObjectType({
    name: 'Notification',
    fields: () => ({
        id: { type: GraphQLID },
        fromUser: { type: UserType },
        date: { type: DateType },
        notificationType: { type: GraphQLString },
        post: { type: PostType },
        friendRequest: { type: FriendRequestType },
        comment: { type: CommentType },
    })
})

const ChatType = new GraphQLObjectType({
    name: 'Chat',
    fields: () => ({
        id: { type: GraphQLID },
        users: { type: new GraphQLList(UserType) },
        messages: { type: new GraphQLList(MessageType) },
    })
})

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLID },
        user: { type: UserType },
        date: { type: DateType },
        isEdited: { type: GraphQLBoolean },
        isSeen: { type: GraphQLBoolean },
    })
})

const PetType = new GraphQLObjectType({
    name: 'Pet',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        owners: { type: new GraphQLList(UserType) },
        dateOfBirth: { type: DateType },
        gender: { type: GraphQLString },
        breed: { type: GraphQLString },
        picturePath: { type: GraphQLString },
    })
})

const PlaygroupType = new GraphQLObjectType({
    name: 'Playgroup',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        playgroupAdmins: { type: new GraphQLList(UserType) },
        members: { type: new GraphQLList(UserType) },
        meetingDates: { type: new GraphQLList(DateType) },
        meetingLocation: { type: GraphQLString }, //Need Change
        dateCreated: { type: DateType },
        playgroupChat: { type: ChatType },
    })
})

const FriendRequestType = new GraphQLObjectType({
    name: 'FriendRequest',
    fields: () => ({
        id: { type: GraphQLID },
        fromUser: { type: UserType },
        toUser: { type: UserType },
        date: { type: DateType },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        users:{
            type: new GraphQLList(UserType),
            resolve(root, args){
                return users
            }
        },
        user:{
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(root, args){
                return users.find(user => user.id === args.id)
            }
        },
        posts:{
            type: new GraphQLList(PostType),
            resolve(root, args){
                return posts
            }
        },
        post:{
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(root, args){
                return posts.find(post => post.id === args.id)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})