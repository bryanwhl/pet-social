import React, { useState, useEffect } from 'react';
import { Avatar, Card, IconButton, CardContent, CardHeader, Button, makeStyles, 
    CardActions, TextField, Container, Grid } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import VideocamIcon from '@material-ui/icons/Videocam';
import { useMutation } from '@apollo/client';
import { submitPostQuery, getPostsQuery, UPLOAD_FILE } from '../../queries.js';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "75vmin",
    margin: "20px",
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
  input: {
    display: "none"
  },
  submit: {
    marginLeft: "auto"
  }
}));


const SubmitPost = ({user, displayName}) => {

  const classes = useStyles();

  const [error, setError] = useState(null);

  const [uploadFile, uploadFileResult] = useMutation(UPLOAD_FILE, {
    // onCompleted: data => {
    //   // console.log("we are here!! " + data)
    //   console.log("after upload")
    //   setPost({ ...post, imageFilePath: data });
    // }
  })

  const [ submitPost, submitPostResult ] = useMutation(submitPostQuery, {
    refetchQueries: [{query: getPostsQuery}],
  })

  const [post, setPost] = useState({user:"", imageFilePath:"", text:"", postType:"image", privacy:"public"});
  const [file, setFile] = useState(null);
  const [imageFilePath, setImageFilePath] = useState("");

  useEffect(() => {
    if ( post.imageFilePath !== "" ) {
      console.log(post);
      submitPost({variables: { user: user.id, imageFilePath: post.imageFilePath, text: post.text, postType: post.postType, privacy: post.privacy }});
      console.log("entering useEffect")
    }
  }, [post.imageFilePath])

  useEffect(() => {
    if ( uploadFileResult.data ) {
      console.log(uploadFileResult.data);
      console.log(uploadFileResult.data.url);
      setPost({ ...post, imageFilePath: uploadFileResult.data.uploadFile.url });
      console.log("entering useEffect")
    }
    //console.log("entering useEffect")
  }, [uploadFileResult.data])

  const handleSetFile = (inputFile) => {
    setFile(inputFile);
  }

  const handleFileChange = (event) => {
    const inputFile = event.target.files[0]
    console.log("File successfully tagged!")
    //uploadFile({variables: {file}});
    handleSetFile(inputFile);
  }

  const handleChange = (prop) => (event) => {
    setPost({ ...post, [prop]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log(file);
    uploadFile({variables: {file}});
    // setPost({ ...post, user: user.id });
    // submitPost({variables: { user: user.id, imageFilePath: post.imageFilePath, text: post.text, postType: post.postType, privacy: post.privacy }});
  }

  return (
    <div>
      <form noValidate enctype="multipart/form-data" onSubmit={handleSubmit}>
      <Container className={classes.cardGrid}>
          <Grid container justify="center">
              <Grid item>
                <Card className={classes.root}>
                  <CardHeader
                    avatar={<Avatar alt="Avatar" src={user.avatarPath} />}
                    title={displayName(user)}
                  />
                  <CardContent>
                    <TextField
                      id="outlined-multiline-static"
                      fullWidth
                      label="Create a Post.."
                      multiline
                      rows={4}
                      placeholder="How's your pet doing?"
                      variant="outlined"
                      onChange={handleChange('text')}
                    />
                  </CardContent>
                  <CardActions disableSpacing>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className={classes.input} 
                      id="icon-button-file" 
                      onChange={handleFileChange}  
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton aria-label="upload picture" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                    <label htmlFor="icon-button-file">
                      <IconButton aria-label="upload picture" component="span">
                        <VideocamIcon />
                      </IconButton>
                    </label>
                    <Button 
                      type="submit"
                      variant="contained" 
                      color="primary" 
                      className={classes.submit} 
                    >
                      Submit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </form>
    </div>
  )
}

export default SubmitPost
