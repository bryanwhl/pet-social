import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline';
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { displayName } from '../../utility.js';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      marginLeft: 390,
      marginTop: 20,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    avatar: {
      backgroundColor: red[500],
    }
  }));

const ProfilePage = ({ user }) => {
    const classes=useStyles();

    return (
        <CssBaseline>
        <Toolbar />
        <div className={classes.root}>
            <ListItem>
                <ListItemIcon>
                    <Avatar alt="Avatar" src={user.avatarPath}>
                        {user.name.givenName[0]}
                    </Avatar>
                </ListItemIcon>
                <Typography>{displayName(user)}</Typography>
            </ListItem>
        </div>
        </CssBaseline>
    )
}

export default ProfilePage
