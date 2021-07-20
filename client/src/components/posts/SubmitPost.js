import React, { useState, useEffect } from 'react';
import { Avatar, Card, IconButton, CardContent, CardHeader, Button, makeStyles, 
    CardActions, TextField, Typography } from '@material-ui/core';
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import VideocamIcon from '@material-ui/icons/Videocam';
import { useMutation } from '@apollo/client';
import { submitPostQuery, getPostsQuery, UPLOAD_FILE } from '../../queries.js';

const useStyles = makeStyles((theme) => ({
  root: {
    // width: "90vmin",
    width: "100%",
    marginTop: "30px"
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

  const [post, setPost] = useState({user:"", imageFilePath:"", text:"", postType:"", privacy:"public"});
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if ( post.imageFilePath !== "" ) {
      console.log(post);
      submitPost({variables: { user: user.id, imageFilePath: post.imageFilePath, text: post.text, postType: post.postType, privacy: post.privacy }});
      console.log("entering useEffect");
      setFile(null);
      // To reset the variables
      setPost({user:"", imageFilePath:"", text:"", postType: "", privacy:"public"});
    }
  }, [post.imageFilePath])

  useEffect(() => {
    if ( uploadFileResult.data ) {
      setPost({ ...post, imageFilePath: uploadFileResult.data.uploadFile.url });
      console.log("entering useEffect")
    }
  }, [uploadFileResult.data])

  const handleVideoFileChange = (event) => {
    let inputFile = event.target.files[0]
    console.log("File successfully tagged!")
    setFile(inputFile);
    setPost({ ...post, postType: 'video' });
  }

  const handleImageFileChange = (event) => {
    let inputFile = event.target.files[0]
    console.log("File successfully tagged!")
    setFile(inputFile);
    setPost({ ...post, postType: 'image' });
  }

  const handleChange = (prop) => (event) => {
    setPost({ ...post, [prop]: event.target.value });
    setError(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log(file);
    setError(false);
    if (file === null) {
      setError(true);
    } else if (post.text === "") {
      setError(true);
    } else {
      uploadFile({variables: {file}});
    }
  }

  return (
    <div>
      <form noValidate enctype="multipart/form-data" onSubmit={handleSubmit}>
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
              error={error === true}
              helperText={error === true ? file === null ? "You must attach a file or a video!" : post.text === "" ? "Post cannot be empty!" : null : null}
              value={post.text}
            />
          </CardContent>
          <CardActions disableSpacing>
            <input 
              type="file" 
              accept="image/*" 
              className={classes.input} 
              id="icon-button-file" 
              onChange={handleImageFileChange}  
            />
            <label htmlFor="icon-button-file">
              <IconButton aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            <input 
              type="file" 
              accept="video/*" 
              className={classes.input} 
              id="icon-button-video" 
              onChange={handleVideoFileChange}  
            />
            <label htmlFor="icon-button-video">
              <IconButton aria-label="upload video" component="span">
                <VideocamIcon />
              </IconButton>
            </label>
            {post.postType === 'video' ? <Typography>
              Video File Attached
            </Typography> : post.postType === 'image' ? <Typography>
              Image File Attached
            </Typography> : null}
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
      </form>
    </div>
  )
}

export default SubmitPost
