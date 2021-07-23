import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { displayName } from '../../utility.js';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from'@material-ui/core/Divider';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import Pet from './Pet.js'
import ProfileTabs from './ProfileTabs.js'
import { useQuery } from '@apollo/client'
import { getUserProfileQuery } from '../../queries.js'
import TopBar from '../toolbar/TopBar.js'
import {
  useLocation,
  useHistory
} from "react-router-dom";

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
    emptyBio: {
      ...theme.typography.button,
      padding: theme.spacing(1),
    },
  }));

const OtherUsersProfilePage = ({setUser, client, user, getCurrentUser}) => {
    const classes=useStyles();
    const [petOpen, setPetOpen] = useState(false);
    const [petMode, setPetMode] = useState(null);
    const [pet, setPet] = useState(null)
    const [profileTab, setProfileTab] = useState(0);
    const [profileBadge, setProfileBadge] = useState(true);
    const [profileData, setProfileData] = useState(null);

    const history = useHistory();
    const logout = () => {
      setUser(null);
      localStorage.clear()
      sessionStorage.clear()
      client.clearStore()
      //client.resetStore() //This causes cache problems
      history.push("/login");
    }

    function useLocationQuery() {
      const location = useLocation()
      return new URLSearchParams(location.search);
    }

    let query = useLocationQuery();

    console.log(query.get("username"))

    const { data, loading, error } = useQuery(getUserProfileQuery, {variables: {username: query.get("username")}})

    useEffect(() => {
      console.log(data)
      if (data) {
        setProfileData(data.getUserProfile);
        console.log(data.getUserProfile)
      }
    }, [data])

    if (loading) {
      return <p>Loading...</p>;
    }

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

    const handleFriendsClick = () => {
      setPet(null)
      setPetMode(null)
    }

    return (
      <CssBaseline>
      <TopBar logout={logout} user={user} client={client} getCurrentUser={getCurrentUser} />
        <Toolbar />
        <div className={classes.root}>
          <Box width={0.3} bgcolor="grey" boxShadow={2}>
            <Grid className={classes.paper} align="center">
              <Badge
                invisible={profileBadge}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={<EditIcon/>}
              >
                <Avatar alt="Avatar" src={profileData ? profileData.avatarPath : null} className={classes.avatar}>
                    {profileData ? profileData.name.givenName[0] : null}
                </Avatar>
              </Badge>
            </Grid>
            <Grid className={classes.paper}>
              <Typography variant="h5" align="center">
                {profileData ? displayName(profileData) : null}
              </Typography>
              <Typography variant="body1" align="center" gutterBottom>
                @{profileData ? profileData.username : null}
              </Typography>
              <Divider/>
              <Grid>
                <Typography align="center" className={profileData ? profileData.profileBio : null ? null : classes.emptyBio}>
                  {profileData ? profileData.profileBio : null}
                </Typography>
              </Grid>
              <Divider/>
              <Box display="flex" marginTop={2} marginBottom={2}>
                <Box width={1} onClick={() => {
                  setPet(null)
                  setPetMode(null)
                  setProfileTab(0)}}
                  style={{cursor: "pointer"}}>
                  <Typography variant="h6" align="center" >
                    {profileData ? profileData.posts.length : null}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Posts
                  </Typography>
                </Box>
                <Box width={1} onClick={handleFriendsClick} style={{cursor: "pointer"}}>
                  <Typography variant="h6" align="center" >
                    {profileData ? profileData.friends.length : null}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Friends
                  </Typography>
                </Box>
              </Box>
              {/* <List >
                <ListItem button onClick={getUserProfile.data ? getUserProfile.data.pets.length===0 ? handleAddPet : handlePetClick : null}>
                    <ListItemIcon>{getUserProfile.data ? getUserProfile.data.pets.length===0 ? <AddIcon/> : petOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/> : null}</ListItemIcon>
                    <ListItemText primary={getUserProfile.data ? getUserProfile.data.pets.length===0 ? "Add Pet" : "Your Pets" : null}/>
                </ListItem>
              </List> */}
              <Collapse in={profileData ? profileData.pets.length!==0 : null && petOpen} timeout="auto" unmountOnExit>
                <List>
                    {profileData ? profileData.pets.map(item => (
                        <ListItem
                            button
                            key={item.id}
                            selected={pet===item.id}
                            onClick={handlePet(item)}
                        >
                            <ListItemIcon><Avatar alt="Pet Avatar" src={item.picturePath} /></ListItemIcon>
                            <ListItemText primary={item.name}></ListItemText>
                        </ListItem>
                    )) : null}
                    {/* <ListItem button onClick={handleAddPet} selected={petMode===true}>
                      <ListItemIcon><AddIcon/></ListItemIcon>
                      <ListItemText primary="Add Pet"></ListItemText>
                    </ListItem> */}
                </List>           
              </Collapse>
            </Grid>
          </Box>
          <Box width={1} marginLeft={'5vw'}>
            {(petMode===null && profileData!==null) && <ProfileTabs user={profileData} profileTab={profileTab} handleProfileTabChange={handleProfileTabChange}/>}
            {(petMode===false) && profileData!==null && <Pet user={profileData} petId={pet} setPetId={setPet} setPetMode={setPetMode}/>}
          </Box>
        </div>
      </CssBaseline>
    )
}

export default OtherUsersProfilePage
