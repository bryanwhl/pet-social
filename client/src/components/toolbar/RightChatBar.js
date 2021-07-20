import { Drawer, Divider } from '@material-ui/core';
import { MenuList, Avatar, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  root: {
      display: 'flex',
  },
  drawerContainer: {
      overflow: 'auto'
  },
  avatar: {
    backgroundColor: green[200],
  },
}));

const handleNotificationClick = () => {
    console.log('Navigate to home')
}

const RightChatBar = ({ drawerState, user }) => {

    const classes = useStyles();

    const notifications = [
        {
            text:"You have received (5) new messages from Bryan Lim",
            icon: <Avatar aria-label="bryan" className={classes.avatar}>
                B
            </Avatar>,
            path:"/",
            time:""
        },
        {
            text: "You have received (2) new messages from Charmaine Lee",
            icon: <Avatar aria-label="Charmaine" className={classes.avatar}>
                    C
                </Avatar>,
            path: "/",
        },
    ]
    

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant='persistent'
                anchor='right'
                open={drawerState}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >       
                <div className={classes.toolbar} />
                <MenuList id="menu-list-grow" disablePadding>
                <div className={classes.drawerContainer}>
                    {notifications.map(item => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={handleNotificationClick}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} secondary={item.time}></ListItemText>
                        </ListItem>
                    ))}
                </div>
                <ListItem>
                    <ListItemText primary={"Chats coming soon"}></ListItemText>
                </ListItem>
                </MenuList>
            </Drawer>
        </div>
    )
}

export default RightChatBar
