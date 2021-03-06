import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { displayName } from '../../utility.js';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from'@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddPet from './AddPet.js'
import Pet from './Pet.js'
import ProfileTabs from './ProfileTabs.js'
import FriendList from './FriendList.js'
import { useMutation } from '@apollo/client'
import { editProfileBioQuery, currentUserQuery, UPLOAD_FILE, editAvatarQuery } from '../../queries.js'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      marginLeft: "20vw",
      marginRight: "20vw",
      marginTop: 20,
      height: "90vh",
      zIndex: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
    input: {
      display: "none"
    },
    avatar: {
      backgroundColor: red[500],
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
    emptyBio: {
      ...theme.typography.button,
      padding: theme.spacing(1),
    },
  }));

const ProfilePage = ({ user, getCurrentUser }) => {
    const classes = useStyles();

    // State variables for profile page screen
    const [petOpen, setPetOpen] = useState(false);
    const [petMode, setPetMode] = useState(null);
    const [friendOpen, setFriendOpen] = useState(false);
    const [pet, setPet] = useState(null)
    const [profileTab, setProfileTab] = useState(0);
    const [profileBadge, setProfileBadge] = useState(true);
    const [bioOpen, setBioOpen] = useState(false);
    const [profileBio, setProfileBio] = useState(user.profileBio);
    const [edittedBio, setEdittedBio] = useState(user.profileBio);

    // Queries for profile page screen
    const [ editProfileBio ] = useMutation(editProfileBioQuery, {refetchQueries: [{query: currentUserQuery}]})
    const [ editAvatar ] = useMutation(editAvatarQuery, {refetchQueries: [{query: currentUserQuery}]})
    const [ uploadFile, uploadFileResponse ] = useMutation(UPLOAD_FILE, {refetchQueries: [{query: currentUserQuery}]})


    useEffect(() => {
      if ( uploadFileResponse.data ) {
        editAvatar({variables: { id: user.id, avatarPath: uploadFileResponse.data.uploadFile.url }});
      }
    }, [uploadFileResponse.data])

    const handleAvatarChange = (event) => {
      const file = event.target.files[0]
      uploadFile({variables: {file}});
    }
    
    // Handles change in profile tab
    const handleProfileTabChange = (event, newValue) => {
      setPet(null)
      setPetMode(null)
      setProfileTab(newValue);
    };

    const handlePetClick = () => {
      setPetOpen(!petOpen);
    };
   
    const handlePet = (item) => () => {
      setPet(item.id)
      setPetMode(false);
      setFriendOpen(false)
    };
    
    const handleAddPet = () => {
      setPetMode(true);
      setPet(null)
      setFriendOpen(false)
    };

    const handleOpenBio = () => {
      setBioOpen(true);
    };

    const handleCloseBio = () => {
      setBioOpen(false);
    };

    const handleFriendsClick = () => {
      setPet(null)
      setPetMode(null)
      setFriendOpen(true)
    }

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
              <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={handleAvatarChange} />
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
                  <Typography align="center" className={profileBio ? null : classes.emptyBio}>
                    {profileBio ? profileBio : "+ Add Profile Bio"}
                  </Typography>
                </Grid>
              </Tooltip>
              <Divider/>
              <Box display="flex" marginTop={2} marginBottom={2}>
                <Box width={1} onClick={() => {
                  setPet(null)
                  setPetMode(null)
                  setFriendOpen(false)
                  setProfileTab(0)}}
                  style={{cursor: "pointer"}}>
                  <Typography variant="h6" align="center" >
                    {user.posts.length}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Posts
                  </Typography>
                </Box>
                <Box width={1} onClick={handleFriendsClick} style={{cursor: "pointer"}}>
                  <Typography variant="h6" align="center" >
                    {user.friends.length}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Friends
                  </Typography>
                </Box>
              </Box>
              <List >
                <ListItem button onClick={user.pets.length===0 ? handleAddPet : handlePetClick}>
                    <ListItemIcon>{user.pets.length===0 ? <AddIcon/> : petOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/>}</ListItemIcon>
                    <ListItemText primary={user.pets.length===0 ? "Add Pet" : "Your Pets"}/>
                </ListItem>
              </List>
              <Collapse in={user.pets.length!==0 && petOpen} timeout="auto" unmountOnExit>
                <List>
                    {user.pets.map(item => (
                        <ListItem
                            button
                            key={item.id}
                            selected={pet===item.id}
                            onClick={handlePet(item)}
                        >
                            <ListItemIcon><Avatar alt="Pet Avatar" src={item.picturePath} /></ListItemIcon>
                            <ListItemText primary={item.name}></ListItemText>
                        </ListItem>
                    ))}
                    <ListItem button onClick={handleAddPet} selected={petMode===true}>
                      <ListItemIcon><AddIcon/></ListItemIcon>
                      <ListItemText primary="Add Pet"></ListItemText>
                    </ListItem>
                </List>           
              </Collapse>
            </Grid>
          </Box>
          <Box width={1} marginLeft={'5vw'}>
            {(petMode===null && !friendOpen) && <ProfileTabs user={user} profileTab={profileTab} handleProfileTabChange={handleProfileTabChange}/>}
            {(petMode===null && friendOpen) && <FriendList user={user} />}
            {(petMode===false) && <Pet user={user} petId={pet} setPetId={setPet} setPetMode={setPetMode}/>}
            {(petMode===true) && <AddPet user={user} setPet={setPet} setPetMode={setPetMode} getCurrentUser={getCurrentUser} />}
          </Box>
          <Dialog onClose={handleCloseBio} open={bioOpen} fullWidth>
            <DialogTitle>Your profile bio</DialogTitle>
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
              <Button onClick={handleSubmitBio} variant="contained" color="primary" disabled={profileBio===edittedBio}>
                Change
              </Button>
              <Button onClick={handleCloseBio} variant="contained" color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </CssBaseline>
    )
}

export default ProfilePage
