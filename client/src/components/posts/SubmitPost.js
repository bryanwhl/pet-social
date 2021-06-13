import React, { useState, useEffect } from 'react';
import { Avatar, Card, IconButton, CardContent, CardHeader, Button, makeStyles, 
    CardActions, TextField, Container, Grid } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import VideocamIcon from '@material-ui/icons/Videocam';
import { useMutation, gql } from '@apollo/client'

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`

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

  const [uploadFile] = useMutation(UPLOAD_FILE, {
    onCompleted: data => {
      console.log("we are here!! " + data)
      // setPost({ ...post, imageFilePath: data });
    }
  })

  // let fileForUpload = null;
  const [post, setPost] = useState({user:"", imageFilePath:"", date:"", text:"", postType:"image", privacy:"public", file:""});

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    console.log("File successfully tagged!")
    uploadFile({variables: {file}});
  }

  const handleChange = (prop) => (event) => {
    setPost({ ...post, [prop]: event.target.value });
  };

  const handleSubmit = event => {
    // event.preventDefault();
    // uploadFile({variables: {fileForUpload}});
    // const username = details.username
    // const password = details.password
    // login({variables: { username, password }});
  }

  return (
    <div>
      <form noValidate onSubmit={handleSubmit}>
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
