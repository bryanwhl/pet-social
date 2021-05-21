import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';

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
        <main>
        <Toolbar />
        <div className={classes.root}>
            <ListItem>
                <ListItemIcon>
                    <Avatar>
                        {user.givenName[0]}
                    </Avatar>
                </ListItemIcon>
                <Typography>{user.displayName}</Typography>
            </ListItem>
        </div>
        </main>
    )
}

export default ProfilePage
