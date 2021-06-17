import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { List, ListItem, ListItemAvatar, ListItemText, ListItemIcon } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { displayName } from '../../utility.js';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexGrow: 1,
      marginTop: 20,
      width: "50vmin",
      height: "15vh",
      zIndex: 1,
    },
  }));

const FriendList = ({ user }) => {
    const classes=useStyles();

    const [selectedFriend, setSelectedFriend] = useState(null)

    const handleFriend = (item) => () => {
        setSelectedFriend(item.id)
    };

    return (
        <div>
            <CssBaseline>
                <Grid container className={classes.root} spacing={1}>
                    <Grid item xs={9}>
                        <Typography variant="h4">Friends</Typography>
                    </Grid>
                    <List>
                        {user.friends.map(item => (
                            <ListItem
                                button
                                key={item.id}
                                selected={selectedFriend===item.id}
                                onClick={handleFriend(item)}
                            >
                                <ListItemIcon><Avatar alt="Avatar" src={item.avatarPath} /></ListItemIcon>
                                <ListItemText primary={displayName(item)}></ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </CssBaseline>
        </div>
    )
}

export default FriendList
