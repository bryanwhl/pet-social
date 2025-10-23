/**
 * Express Server Setup
 * Basic Express application configuration for Pet Social
 * Note: This is a minimal setup - main GraphQL server logic is in schema.js
 */

const express = require('express')
const cors = require('cors')

/**
 * Creates and configures Express application instance
 * Sets up CORS middleware for cross-origin requests
 */
const app = express()

// Enable cross-origin resource sharing for all routes
app.use(cors())

module.exports = app

