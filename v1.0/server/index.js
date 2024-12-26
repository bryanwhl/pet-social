const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema.js')
const cors = require('cors')

const app = express()

//Allow cross-origin requests
app.use(cors())


