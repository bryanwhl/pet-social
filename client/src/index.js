import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { from, ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from 'apollo-link-context'
import { createUploadLink } from 'apollo-upload-client'
import { RetryLink } from 'apollo-link-retry';
import { getMainDefinition } from 'apollo-utilities';
import { extractFiles } from 'extract-files';
import { ApolloLink } from 'apollo-link';


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

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql'
})

const uploadAndBatchHTTPLink = opts => ApolloLink.split(
  operation => extractFiles(operation).files.size > 0,
  uploadLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: uploadAndBatchHTTPLink()
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
