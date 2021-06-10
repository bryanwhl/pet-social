import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { displayName } from '../../utility.js';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Divider from'@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Post from '../posts/Post.js'
import { useLazyQuery, useMutation } from '@apollo/client'
import { getPostByIdQuery, editProfileBioQuery, currentUserQuery } from '../../queries.js'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      marginLeft: "20vw",
      marginRight: "20vw",
      marginTop: 20,
      height: "100vh",
      zIndex: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
    input: {
      display: "none"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    avatar: {
      backgroundColor: red[500],
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
    card: {
      minWidth: 240
    },
    media: {
      paddingTop: '100%', // 16:9
    },
    dialog: {
      width: "75vmin"
    },
  }));

const ProfilePage = ({ user }) => {
    const classes=useStyles();
    const [profileTab, setProfileTab] = useState(0);
    const [profileBadge, setProfileBadge] = useState(true);
    const [postOpen, setPostOpen] = useState(false);
    const [bioOpen, setBioOpen] = useState(false);
    const [backdropPost, setBackdropPost] = useState(null);
    const [profileBio, setProfileBio] = useState(user.profileBio);
    const [edittedBio, setEdittedBio] = useState(user.profileBio);

    const [getQueryPost, queryPost] = useLazyQuery(getPostByIdQuery, {
      fetchPolicy: "no-cache"
    })
    const [ editProfileBio ] = useMutation(editProfileBioQuery, {refetchQueries: [{query: currentUserQuery}]})

    useEffect(() => {
      if (queryPost.data) {
        setBackdropPost(queryPost.data.findPost)
      }
    }, [queryPost.data])

    const handleProfileTabChange = (event, newValue) => {
      setProfileTab(newValue);
    };

    const handleOpenPost = (item) => {
      setPostOpen(true);
      const id = item.id
      getQueryPost({variables: {id}})
    };

    const handleClosePost = () => {
      setPostOpen(false);
      setBackdropPost(null)
    };

    const handleOpenBio = () => {
      setBioOpen(true);
    };

    const handleCloseBio = () => {
      setBioOpen(false);
    };

    const handleSubmitBio = (event) => {
      event.preventDefault();
      const id = user.id
      editProfileBio({variables: {id: id, profileBio: edittedBio}})
      setProfileBio(edittedBio)
      handleCloseBio()
  }

    const handleEditBio = (event) => {
      setEdittedBio(event.target.value)
    }

    return (
        <CssBaseline>
        <Toolbar />
        <div className={classes.root}>
          <Box width={0.3} bgcolor="grey" boxShadow={2}>
            <Grid className={classes.paper} align="center">
              <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
              <label htmlFor="icon-button-file">
                <IconButton aria-label="change profile picture" component="span" onMouseEnter={() => setProfileBadge(false)} onMouseLeave={() => setProfileBadge(true)}>
                  <Badge
                    invisible={profileBadge}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    badgeContent={<EditIcon/>}
                  >
                    <Avatar alt="Avatar" src={user.avatarPath} className={classes.avatar}>
                        {user.name.givenName[0]}
                    </Avatar>
                  </Badge>
                </IconButton>
              </label>
            </Grid>
            <Grid className={classes.paper}>
              <Typography variant="h5" align="center">
                {displayName(user)}
              </Typography>
              <Typography variant="body1" align="center" gutterBottom>
                @{user.username}
              </Typography>
              <Divider/>
              <Tooltip title="Edit Bio">
                <Grid style={{cursor: "pointer"}} onClick={handleOpenBio}>
                  <Typography align="center" variant="body1">
                    {profileBio}
                  </Typography>
                </Grid>
              </Tooltip>
              <Divider/>
              <Box display="flex" marginTop={2} marginBottom={2}>
                <Box width={1} onClick={() => setProfileTab(0)} style={{cursor: "pointer"}}>
                  <Typography variant="h6" align="center" >
                    {user.posts.length}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Posts
                  </Typography>
                </Box>
                <Box width={1}>
                  <Typography variant="h6" align="center" >
                    {user.friends.length}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Friends
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Box>
          <Box width={1} marginLeft={'5vw'}>
            <Tabs
              value={profileTab}
              onChange={handleProfileTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Posts" />
              <Tab label="Tagged" />
              <Tab label="Saved" />
            </Tabs>
            <TabPanel value={profileTab} index={0}>
              <Grid container spacing={2} justify="center">
                {user.posts.map(item => (
                    <Grid item style={{cursor: "pointer"}} onClick={() => handleOpenPost(item)}>
                      <Card className={classes.card}>
                        <CardMedia className={classes.media} image={item.imageFilePath} title="Post"/>
                      </Card>
                    </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={profileTab} index={1}>
              <Grid container spacing={2} justify="center">
                Tagged Posts Coming Soon
              </Grid>
            </TabPanel>
            <TabPanel value={profileTab} index={2}>
              <Grid container spacing={2} justify="center">
                {user.savedPosts.map(item => (
                    <Grid item style={{cursor: "pointer"}} onClick={() => handleOpenPost(item)}>
                      <Card className={classes.card}>
                        <CardMedia className={classes.media} image={item.imageFilePath} title="Post"/>
                      </Card>
                    </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Box>
          <Dialog onClose={handleClosePost} open={postOpen} scroll={"body"} fullWidth
          PaperProps={{
            style: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              maxWidth: "75vmin"
            },
          }}>
            {backdropPost && <Post user={user} post={backdropPost}/>}
          </Dialog>
          <Dialog onClose={handleCloseBio} open={bioOpen} fullWidth>
            <DialogTitle>Edit your profile bio</DialogTitle>
            <DialogContent>
              <TextField
                label="Profile Bio"
                id="edit-profile-bio"
                defaultValue={profileBio}
                variant="outlined"
                fullWidth
                onChange={handleEditBio}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSubmitBio} color="primary" disabled={profileBio===edittedBio}>
                Edit
              </Button>
              <Button onClick={handleCloseBio} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        </CssBaseline>
    )
}

export default ProfilePage
