import React, { useState } from 'react'
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
import Pet from './Pet.js'
import ProfileTabs from './ProfileTabs.js'
import { useMutation } from '@apollo/client'
import { editProfileBioQuery, currentUserQuery } from '../../queries.js'

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
    const [petOpen, setPetOpen] = useState(false);
    const [petMode, setPetMode] = useState(null);
    const [pet, setPet] = useState(null)
    const [profileTab, setProfileTab] = useState(0);
    const [profileBadge, setProfileBadge] = useState(true);
    const [bioOpen, setBioOpen] = useState(false);
    const [profileBio, setProfileBio] = useState(user.profileBio);
    const [edittedBio, setEdittedBio] = useState(user.profileBio);

    const [ editProfileBio ] = useMutation(editProfileBioQuery, {refetchQueries: [{query: currentUserQuery}]})

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
    };
    
    const handleAddPet = () => {
      setPetMode(true);
      setPet(null)
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
                <Box width={1} onClick={() => {
                  setPet(null)
                  setPetMode(null)
                  setProfileTab(0)}}
                  style={{cursor: "pointer"}}>
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
              <List>
                <ListItem button onClick={handlePetClick}>
                    <ListItemIcon>{petOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/>}</ListItemIcon>
                    <ListItemText primary="Your Pets"/>
                </ListItem>
              </List>
              <Collapse in={petOpen} timeout="auto" unmountOnExit>
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
            {(petMode===null) && <ProfileTabs user={user} profileTab={profileTab} handleProfileTabChange={handleProfileTabChange}/>}
            {(petMode!==null) && <Pet user={user} pet={pet} isAddPet={petMode} />}
          </Box>
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
