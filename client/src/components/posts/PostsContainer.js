import React from 'react'
import Post from './Post.js'
import SubmitPost from './SubmitPost.js'
import { Grid, makeStyles, Container } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client'
import { getPostsQuery } from '../../queries.js'
import { displayName } from '../../utility.js'

const useStyles = makeStyles((theme) => ({
  containerGrid: {
      padding: "60px",
      width: "45vmax",
      minWidth: "450px",
  },
}));

const PostsContainer = ({ user }) => {

  // Queries all public posts
  const allPosts = useQuery(getPostsQuery);

  // State variable to store all posts queried
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (allPosts.data) {
      console.log(allPosts.data);
      let outputArr = allPosts.data.getPosts.slice().sort((a, b) => {return b.date - a.date}); 
      setPosts(outputArr);
    }
  }, [allPosts])

  const classes = useStyles();

  return (
    <Container className={classes.containerGrid}>
      <Grid container justify="center" alignItems="stretch" wrap="nowrap" direction="column">
        <Grid item justify="center">
          <SubmitPost user={user} displayName={displayName}/>
        </Grid>
        {posts.map(item => (
          <Grid item justify="center">
            <Post user={user} post={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default PostsContainer
