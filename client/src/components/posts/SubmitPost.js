import React from 'react';
import { Avatar, Card, IconButton, CardContent, CardHeader, Button, makeStyles, 
    CardActions, TextField, Container, Grid } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import VideocamIcon from '@material-ui/icons/Videocam';

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

  return (
    <div>
      <Container className={classes.cardGrid}>
          <Grid container justify="center">
              <Grid item>
                <Card className={classes.root}>
                  <CardHeader
                    avatar={<Avatar alt="Avatar" src='../static/images/cute-dog.jpg' />}
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
                    />
                  </CardContent>
                  <CardActions disableSpacing>
                    <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
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
                    <Button variant="contained" color="primary" className={classes.submit} onClick={() => { alert('Post submitted!') }}>Submit</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Container>
    </div>
  )
}

export default SubmitPost
