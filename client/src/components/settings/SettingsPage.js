import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChatIcon from '@material-ui/icons/Chat';
import SecurityIcon from '@material-ui/icons/Security';
import AccountSettings from './AccountSettings.js';
import NotificationsSettings from './NotificationsSettings.js';
import PrivacySettings from './PrivacySettings.js';
import { red } from '@material-ui/core/colors';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      marginLeft: 70,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      zIndex: theme.zIndex.drawer - 1,
    },
    drawerPaper: {
      width: drawerWidth,
      marginTop: -4,
      background: 'lightGrey',
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    avatar: {
      backgroundColor: red[500],
    }
  }));

const SettingsPage = ({ user, deleteAccount, updateUser, displayName }) => {
    
    const classes = useStyles();
    const [settingsState, setSettingsState] = useState("Account");

    const switchToAccount = () => {
        setSettingsState("Account")
    }

    const switchToNotifications = () => {
        setSettingsState("Notifications")
    }

    const switchToPrivacy = () => {
        setSettingsState("Privacy")
    }

    const settingsItems = [
        {
            text: "Account",
            icon: <AccountCircleIcon />,
            path: "/",
            selected: (settingsState === "Account"),
            onClick: switchToAccount
        },
        {
            text: "Notifications",
            icon: <ChatIcon />,
            path: "/",
            selected: (settingsState === "Notifications"),
            onClick: switchToNotifications
        },
        {
            text: "Privacy",
            icon: <SecurityIcon />,
            path: "/",
            selected: (settingsState === "Privacy"),
            onClick: switchToPrivacy
        }
    ]

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <List>
              <ListItem>
                  <ListItemText primary="Settings" />
              </ListItem>
              {settingsItems.map(item => (
                  <ListItem
                      button
                      key={item.text}
                      selected={item.selected}
                      divider={item.divider}
                      onClick={item.onClick}
                  >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text}></ListItemText>
                  </ListItem>
              ))}
              </List>
          </div>
        </Drawer>
        <main className={classes.content}>
          <Toolbar />
          {settingsState === "Account" && <AccountSettings user={user} deleteAccount={deleteAccount} updateUser={updateUser} displayName={displayName}/>}
          {settingsState === "Notifications" && <NotificationsSettings user={user} />}
          {settingsState === "Privacy" && <PrivacySettings user={user} />}
        </main>
      </div>
    )
}

export default SettingsPage
