import React from 'react'
import Post from './Post.js'
import { Grid, makeStyles, Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  containerGrid: {
      padding: "60px",
  },
}));

const PostsContainer = () => {
  const classes = useStyles();

  return (
    <Container className={classes.containerGrid}>
      <Grid container justify="center">
        <Grid item>
          <Post />
        </Grid>
        <Grid item>
          <Post />
        </Grid>
      </Grid>
    </Container>
  )
}

export default PostsContainer
