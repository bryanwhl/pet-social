import React from 'react'
import Post from './Post.js'
import SubmitPost from './SubmitPost.js'
import { Grid, makeStyles, Container, Divider } from '@material-ui/core';
import { red, blue } from '@material-ui/core/colors';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client'
import { getPostsQuery } from '../../queries.js'
import { displayName } from '../../utility.js'

const useStyles = makeStyles((theme) => ({
  containerGrid: {
      padding: "60px",
  },
  avatarRed: {
      backgroundColor: red[500],
  },
  avatarBlue: {
      backgroundColor: blue[500],
  },
}));

const PostsContainer = ({ user }) => {

  const allPosts = useQuery(getPostsQuery);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (allPosts.data) {
      console.log(allPosts.data)
      setPosts(allPosts.data.getPosts)
    }
  }, [allPosts])

  const classes = useStyles();

  return (
    <Container className={classes.containerGrid}>
      <Grid container justify="center" alignItems="stretch">
        <Grid item justify="center">
          <SubmitPost user={user} displayName={displayName}/>
        </Grid>
        <Divider />
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
