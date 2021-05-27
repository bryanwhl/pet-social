import React from 'react'
import Post from './Post.js'
import SubmitPost from './SubmitPost.js'
import { Grid, makeStyles, Container, Avatar, Divider } from '@material-ui/core';
import { red, blue } from '@material-ui/core/colors';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client'
import { getPostsQuery } from '../../queries.js'

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

const PostsContainer = ({user, displayName}) => {

  const allPosts = useQuery(getPostsQuery);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (allPosts.data) {
      console.log(allPosts.data)
      setPosts(allPosts.data.getPosts)
    }
  }, [allPosts])

  const classes = useStyles();
  
  // let posts = [
  //     {
  //         id: "1",
  //         user: {
  //             id: "3",
  //             username: "bryanwhl",
  //             accountType: "Personal",
  //             name: {
  //               givenName: "Bryan",
  //               familyName: "Wong",
  //             },
  //             avatarPath: 'http://localhost:4000/images/cute-dog.jpg',
  //             otherSettings: {
  //               familyNameFirst: false,
  //             }
  //         },
  //         date: "21 May 2021",
  //         postType: "Image",
  //         privacy: "Public",
  //         imageFilePath: "http://localhost:4000/images/jaryl.jpg",
  //         videoFilePath: "",
  //         location: "",
  //         text: "Botanic Gardens: Best place to bring Jaryl to for a day of entertainment!",
  //         tagged: [],
  //         likedBy: [],
  //         comments: [
  //         {
  //             user: {
  //               name: {
  //                 givenName: "Gregg",
  //                 familyName: "Tang",
  //               },
  //               otherSettings: {
  //                 familyNameFirst: false,
  //               },
  //               avatarPath: "http://localhost:4000/images/dogprofilepic.jpg",
  //             },
  //             comment: "Let's go together some day with my Corgi!"
  //         }],
  //         isEdited: false,
  //     },
  //     {
  //         id: "2",
  //         user: {
  //             id: "3",
  //             username: "bryanwhl",
  //             accountType: "Personal",
  //             name: {
  //               givenName: "Bryan",
  //               familyName: "Wong",
  //             },
  //             avatarPath: 'http://localhost:4000/images/cute-dog.jpg',
  //             otherSettings: {
  //               familyNameFirst: false,
  //             }
  //         },
  //         date: "21 May 2021",
  //         postType: "Image",
  //         privacy: "Public",
  //         imageFilePath: "http://localhost:4000/images/eastcoast.jpg",
  //         videoFilePath: "",
  //         location: "",
  //         text: "Took my dogs out to East Coast Park for a walk today. They seem to enjoy the sea breeze a lot!",
  //         tagged: [],
  //         likedBy: [],
  //         comments: [
  //           {
  //             user: {
  //               name: {
  //                 givenName: "Gregg",
  //                 familyName: "Tang",
  //               },
  //               otherSettings: {
  //                 familyNameFirst: false,
  //               },
  //               avatarPath: "http://localhost:4000/images/dogprofilepic.jpg",
  //             },
  //             comment: "Let's go together some day with my Corgi!"
  //           },
  //           {
  //             user: {
  //               name: {
  //                 givenName: "Gregg",
  //                 familyName: "Tang",
  //               },
  //               otherSettings: {
  //                 familyNameFirst: false,
  //               },
  //               avatarPath: "http://localhost:4000/images/dogprofilepic.jpg",
  //             },
  //             comment: "Let's go together some day with my Corgi!"
  //           },
  //           {
  //             user: {
  //               name: {
  //                 givenName: "Gregg",
  //                 familyName: "Tang",
  //               },
  //               otherSettings: {
  //                 familyNameFirst: false,
  //               },
  //               avatarPath: "http://localhost:4000/images/dogprofilepic.jpg",
  //             },
  //             comment: "Let's go together some day with my Corgi!"
  //           }],
  //         isEdited: false,
  //     }
  // ]
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
