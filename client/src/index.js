import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { from, ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from 'apollo-link-context'
import { createUploadLink } from 'apollo-upload-client'
import { RetryLink } from 'apollo-link-retry';
import { getMainDefinition } from 'apollo-utilities';
import { extractFiles } from 'extract-files';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from '@apollo/client/link/ws'

const isFile = value => (
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob)
);

const isUpload = ({ variables }) =>
  Object.values(variables).some(isFile);

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' }) //Rmb to change

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/subscriptions`,
  options: {
    reconnect: true,
  }
})

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query)
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   authLink.concat(httpLink),
// )


const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql'
})

// const uploadAndBatchHTTPLink = opts => ApolloLink.split(
//   operation => extractFiles(operation).files.size > 0,
//   uploadLink,
//   authLink.concat(httpLink),
//   ({ query }) => {
//     const definition = getMainDefinition(query)
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
// );

//const link = ApolloLink.from([splitLink, uploadAndBatchHTTPLink])

const isSubscriptionOperation = ({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === 'OperationDefinition' && operation === 'subscription';
};

const requestLink = split(isSubscriptionOperation, wsLink, authLink.concat(httpLink));

const terminalLink = split(isUpload, uploadLink, requestLink);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: terminalLink
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App client={client}/>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
