import { Drawer, Divider } from '@material-ui/core';
import { MenuList, Avatar, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
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

const RightChatBar = ({ drawerState }) => {

    const classes = useStyles();

    const notifications = [
        {
            text:"",
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
                <Divider />
                <Divider />
                <Divider />
                <Divider />
                <MenuList id="menu-list-grow">
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
                </MenuList>
            </Drawer>
        </div>
    )
}

export default RightChatBar
