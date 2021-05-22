import React from 'react'
import Post from './Post.js'
import SubmitPost from './SubmitPost.js'
import { Grid, makeStyles, Container, Avatar } from '@material-ui/core';
import dogImage from '../static/images/eastcoast.jpg';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  containerGrid: {
      padding: "60px",
  },
  avatarRed: {
      backgroundColor: red[500],
  },
}));

const PostsContainer = () => {

  const classes = useStyles();
  
  const posts = [
    {
      name: "Bryan Wong",
      avatar: <Avatar aria-label="bryan" className={classes.avatarRed}>
              B
          </Avatar>,
      // path to the OP's profile
      path: "/",
      content: "Took my dogs out to East Coast Park for a walk today. They seem to enjoy the sea breeze a lot!",
      image: dogImage,
      date: "21 May 2021",
      comments: [
      {
          text: "Bryan Tan",
          icon: <Avatar aria-label="bryan" className={classes.avatarBlue}>
                  B
              </Avatar>,
          path: "/",
          comment: "OMG your dogs are so cute!!"
      },
      {
          text: "Gregg Tang",
          icon: <Avatar aria-label="bryan" className={classes.avatarBlue}>
                  G
              </Avatar>,
          path: "/",
          comment: "Was the sea breeze strong at East Coast Park? I want to bring my Rabbit there too!"
      },
      {
          text: "Zanden Lim",
          icon: <Avatar aria-label="bryan" className={classes.avatarBlue}>
                  Z
              </Avatar>,
          path: "/",
          comment: "I was there an hour ago too! Was a pity we missed each other."
      }]
    },
    {
      name: "Bryan Leong",
      avatar: <Avatar aria-label="bryan" className={classes.avatarRed}>
              C
          </Avatar>,
      // path to the OP's profile
      path: "/",
      content: "I hate dogs",
      image: dogImage,
      date: "21 May 2021",
      comments: [
      {
          text: "Bryan Tan",
          icon: <Avatar aria-label="bryan" className={classes.avatarBlue}>
                  B
              </Avatar>,
          path: "/",
          comment: "OMG your dogs are so cute!!"
      },
      {
          text: "Gregg Tang",
          icon: <Avatar aria-label="bryan" className={classes.avatarBlue}>
                  G
              </Avatar>,
          path: "/",
          comment: "Was the sea breeze strong at East Coast Park? I want to bring my Rabbit there too!"
      },
      {
          text: "Zanden Lim",
          icon: <Avatar aria-label="bryan" className={classes.avatarBlue}>
                  Z
              </Avatar>,
          path: "/",
          comment: "I was there an hour ago too! Was a pity we missed each other."
      }]
    }
  ]
  return (
    <Container className={classes.containerGrid}>
      <Grid container justify="center">
        <Grid item>
          <SubmitPost />
        </Grid>
        {posts.map(item => (
          <Grid item>
            <Post post={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default PostsContainer
