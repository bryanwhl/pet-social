const express = require('express')
const { graphqlHTTP } = require('express-graphql')

//GraphQL Imports
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const app = express()

const users = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    accountType: "Personal",
    givenName: "Ad",
    familyName: "Min",
    displayName: "Ad Min",
    nameOrder: false,
    avatarPath: './components/static/images/cute-dog.jpg'
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
    avatar: './components/static/images/cute-dog.jpg'
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
    avatar: './components/static/images/doctorstrange.jpg'
  },
]

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

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.listen(5000., () => console.log('Server Running'))
