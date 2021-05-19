import React from 'react';
import {Grid, Container, Card, IconButton, 
    CardMedia, CardContent, Typography, 
    Avatar, CardHeader, Button, makeStyles, 
    CardActions, TextField, Grow, Paper, ClickAwayListener, MenuList, Popper, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import CommentIcon from '@material-ui/icons/Comment';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import { red } from '@material-ui/core/colors';
import dogImage from './static/images/eastcoast.jpg';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import CancelIcon from '@material-ui/icons/Cancel';
import ReportIcon from '@material-ui/icons/Report';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import VideocamIcon from '@material-ui/icons/Videocam';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 700,
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


const SubmitPost = () => {

  const classes = useStyles();

  return (
    <div>
      <Card className="pt-6" className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="avatar" className={classes.avatar}>
              B
            </Avatar>
          }
          title="Bryan Wong"
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
    </div>
  )
}

export default SubmitPost
