import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { displayName } from '../../utility.js';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Divider from'@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      marginLeft: 390,
      marginRight: 390,
      marginTop: 20,
      height: "100vh",
    },
    paper: {
      padding: theme.spacing(2),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    avatar: {
      backgroundColor: red[500],
      width: theme.spacing(20),
      height: theme.spacing(20),
    }
  }));

const ProfilePage = ({ user }) => {
    const classes=useStyles();
    const [profileTab, setProfileTab] = useState(0);

    const handleProfileTabChange = (event, newValue) => {
      setProfileTab(newValue);
    };

    return (
        <CssBaseline>
        <Toolbar />
        <div className={classes.root}>
          <Box width={0.3} bgcolor="grey" boxShadow={2}>
            <Grid className={classes.paper} align="center">
              <Avatar alt="Avatar" src={user.avatarPath} className={classes.avatar}>
                  {user.name.givenName[0]}
              </Avatar>
            </Grid>
            <Grid className={classes.paper}>
              <Typography variant="h4" align="center">
                {displayName(user)}
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                @{user.username}
              </Typography>
              <Divider/>
              <Typography align="center" variant="body1">
                {user.profileBio}
              </Typography>
              <Divider/>
              <Box display="flex" marginTop={2} marginBottom={2}>
                <Box width={1}>
                  <Typography variant="h6" align="center" >
                    1
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Posts
                  </Typography>
                </Box>
                <Box width={1}>
                  <Typography variant="h6" align="center" >
                    1
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Friends
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Box>
          <Box width={1}>
            <Tabs
              value={profileTab}
              onChange={handleProfileTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Posts" />
              <Tab label="Tagged" />
              <Tab label="Other" />
            </Tabs>
          </Box>
        </div>
        </CssBaseline>
    )
}

export default ProfilePage
