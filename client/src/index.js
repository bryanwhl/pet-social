/**
 * Application Entry Point
 * Configures Apollo GraphQL client with authentication, file uploads, and WebSocket subscriptions
 * Sets up React application with GraphQL provider
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from 'apollo-link-context'
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from '@apollo/client/link/ws'

/**
 * Checks if a value is a File or Blob object
 * @param {any} value - Value to check
 * @returns {boolean} True if value is File or Blob
 */
const isFile = value => (
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob)
);

/**
 * Determines if a GraphQL operation contains file uploads
 * @param {Object} operation - GraphQL operation with variables
 * @returns {boolean} True if operation contains file uploads
 */
const isUpload = ({ variables }) =>
  Object.values(variables).some(isFile);

/**
 * Apollo Link for adding authentication headers to requests
 * Retrieves JWT token from session storage and adds to Authorization header
 */
const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

// HTTP link for GraphQL queries and mutations
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' })

// WebSocket link for GraphQL subscriptions with auto-reconnect
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/subscriptions`,
  options: {
    reconnect: true,
  }
})

// Upload link for file upload operations
const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql'
})

/**
 * Determines if a GraphQL operation is a subscription
 * @param {Object} operation - GraphQL operation with query
 * @returns {boolean} True if operation is a subscription
 */
const isSubscriptionOperation = ({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === 'OperationDefinition' && operation === 'subscription';
};

// Split link: subscriptions go to WebSocket, others to HTTP with auth
const requestLink = split(isSubscriptionOperation, wsLink, authLink.concat(httpLink));

// Terminal link: file uploads go to upload link, others to request link
const terminalLink = split(isUpload, uploadLink, requestLink);

// Configure Apollo Client with cache and link chain
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: terminalLink
})

// Render React application with Apollo GraphQL provider
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App client={client}/>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Start measuring performance metrics
reportWebVitals();
