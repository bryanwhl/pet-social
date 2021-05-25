const express = require('express')
const { graphqlHTTP } = require('express-graphql')

// GraphQL Imports
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const app = express()

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
    profilePicturePath: String,
    posts: Array[Post],
    friends: Array[User],
    chat: Array[Chat],
    savedPosts: Array[Post],
    blockedUsers: Array[User],
    notifications: Array[Notification],
    online: Boolean,
    registered: Date,
    profileBio: "String",
    otherSettings: {
      nameOrder: Boolean,
      defaultPrivacy: Boolean
    }
  },
  {
    id: "2",
    username: "Pet Social",
    password: "admin123",
    accountType: "Business",
    givenName: "Pet",
    familyName: "Social",
    displayName: "Pet Social",
    nameOrder: false,
    avatarPath: './components/static/images/cute-dog.jpg'
  },
  {
    id: "3",
    username: "bryanwhl",
    password: "admin123",
    accountType: "Personal",
    givenName: "Bryan",
    familyName: "Wong",
    displayName: "Bryan Wong",
    nameOrder: false,
    avatarPath: './components/static/images/doctorstrange.jpg',
  },
]

// Instance of GraphQL Schema
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'HelloWorld',
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => 'Hello World'
      }
    })
  })
})

// GraphiQL interface on localhost:5000/graphql
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.listen(5000., () => console.log('Server Running'))
