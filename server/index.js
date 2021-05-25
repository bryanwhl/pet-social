const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema.js')
const cors = require('cors')

// GraphQL Imports
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const app = express()

//Allow cross-origin requests
app.use(cors())

// GraphiQL interface on localhost:5000/graphql
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
