import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { displayName } from '../../utility.js';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from'@material-ui/core/Divider';
import { List, ListItem, ListItemIcon, ListItemText, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import OtherUsersPet from './OtherUsersPet.js'
import OtherUsersProfileTabs from './OtherUsersProfileTabs.js'
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/client';
import { getUserProfileQuery } from '../../queries.js'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TopBar from '../toolbar/TopBar.js'
import {
  useLocation,
  useHistory
} from "react-router-dom";
import { currentUserQuery, sendFriendRequestQuery, retractFriendRequestQuery, acceptFriendRequestQuery } from '../../queries.js';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    avatar: {
      width: theme.spacing(18),
      height: theme.spacing(18),
    },
  }));

const OtherUsersProfilePage = ({setUser, client, user, getCurrentUser}) => {
    const classes = useStyles();
    const [openSnackbar, setOpenSnackbar] = useState(null)
    const [error, setError] = useState(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success")
    const [petMode, setPetMode] = useState(null);
    const [pet, setPet] = useState(null)
    const [profileTab, setProfileTab] = useState(0);
    const [profileBadge, setProfileBadge] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [friendRequestText, setFriendRequestText] = useState(false);

    const history = useHistory();

    // Logs out and redirect to /login
    const logout = () => {
      setUser(null);
      localStorage.clear()
      sessionStorage.clear()
      client.clearStore()
      history.push("/login");
    }

    function useLocationQuery() {
      const location = useLocation()
      return new URLSearchParams(location.search);
    }

    let query = useLocationQuery();

    const { data, loading } = useQuery(getUserProfileQuery, {variables: {username: query.get("username")}})

    // Sets profile data
    useEffect(() => {
      if (data) {
        setProfileData(data.getUserProfile);
      }
    }, [data])

    // Query for sending friend request
    const [ sendFriendRequest,  sendFriendRequestResponse ] = useMutation(sendFriendRequestQuery, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
         }, refetchQueries: [{query: currentUserQuery}]
    })

    // Query for retracting friend request
    const [ retractFriendRequest,  retractFriendRequestResponse ] = useMutation(retractFriendRequestQuery, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
         }, refetchQueries: [{query: currentUserQuery}]
    })

    // Query for accepting friend request
    const [ acceptFriendRequest,  acceptFriendRequestResponse ] = useMutation(acceptFriendRequestQuery, {
        onError: (error) => {
          setError(error.graphQLErrors[0].message)
         }, refetchQueries: [{query: currentUserQuery}]
    })

    // Sets profile tab
    const handleProfileTabChange = (event, newValue) => {
      setPet(null)
      setPetMode(null)
      setProfileTab(newValue);
    };
   
    // Handles pet tab change
    const handlePet = (item) => () => {
      setPet(item.id)
      setPetMode(false);
    };

    // Chooses the query depending on the friendship status
    const handleFriendRequestClick = () => {
      if (friendRequestText === "Add as Friend") {
        sendFriendRequest({variables: {from: user.id, to: profileData.id}})
      } else if (friendRequestText === "Retract Friend Request") {
        retractFriendRequest({variables: {from: user.id, to: profileData.id}})
      } else if (friendRequestText === "Accept Friend Request") {
        acceptFriendRequest({variables: {from: profileData.id, to: user.id}})
      }
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(null)
    }

    const handleOpenSnackbar = (input, severity) => {
        setOpenSnackbar(input)
        setSnackbarSeverity(severity)
    }

    // Sends friend requests
    useEffect(() => {
      if (data) {
          if (user.sentFriendRequests.map(request => request.toUser.id).includes(data.getUserProfile.id)) {
              setFriendRequestText("Retract Friend Request")
          } else if (user.receivedFriendRequests.map(request => request.fromUser.id).includes(data.getUserProfile.id)) {
              setFriendRequestText("Accept Friend Request")
          } else {
              setFriendRequestText("Add as Friend")
          }
      }
    }, [data])

    useEffect(() => {
      if (retractFriendRequestResponse.data) {
          if (!error) {
              handleOpenSnackbar("Friend Request Retracted", "success")
              setFriendRequestText("Add as Friend")
          } else {
              handleOpenSnackbar(error, "error")
          }
      }
    }, [retractFriendRequestResponse.data])

    useEffect(() => {
      if (sendFriendRequestResponse.data) {
          if (!error) {
              handleOpenSnackbar("Friend Request Sent", "success")
              setFriendRequestText("Retract Friend Request")
          } else {
              handleOpenSnackbar(error, "error")
          }
      }
    }, [sendFriendRequestResponse.data])

    useEffect(() => {
      if (acceptFriendRequestResponse.data) {
          if (!error) {
              handleOpenSnackbar("Friend Request Accepted", "success")
              setFriendRequestText(false)
          } else {
              handleOpenSnackbar(error, "error")
          }
      }
    }, [acceptFriendRequestResponse.data])

    useEffect(() => {
      if (error) {
          handleOpenSnackbar(error, "error")
      }
    }, [error])

    if (loading) {
      return <p>Loading...</p>;
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
                <Box width={1}>
                  <Typography variant="h6" align="center" >
                    {profileData ? profileData.friends.length : null}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Friends
                  </Typography>
                </Box>
              </Box>
              <List>
                  {(profileData && friendRequestText !== false && user.id !== profileData.id && !user.friends.map(friend => friend.id).includes(profileData.id)) && <ListItem button onClick={handleFriendRequestClick}>
                      <ListItemIcon>
                          {<PersonAddIcon />}
                      </ListItemIcon>
                      <Typography>{friendRequestText}</Typography>
                  </ListItem>}
                  {profileData && profileData.pets.length !== 0 ? <ListItem>
                    <ListItemText primary="Pets:" />
                  </ListItem> : <ListItem>
                    <ListItemText primary="No pet listed" />
                  </ListItem>}
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
              </List>           
            </Grid>
          </Box>
          <Box width={1} marginLeft={'5vw'}>
            {(petMode===null && profileData!==null) && <OtherUsersProfileTabs user={profileData} profileTab={profileTab} handleProfileTabChange={handleProfileTabChange}/>}
            {(petMode===false) && profileData!==null && <OtherUsersPet user={profileData} petId={pet} setPetId={setPet} setPetMode={setPetMode}/>}
          </Box>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {openSnackbar}
        </Alert>
        </Snackbar>
        </div>
      </CssBaseline>
    )
}

export default OtherUsersProfilePage
