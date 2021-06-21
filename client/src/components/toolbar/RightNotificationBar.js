import { Drawer, Divider } from '@material-ui/core';
import { MenuList, Avatar, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

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
    backgroundColor: blue[500],
  },
}));

const handleNotificationClick = () => {
    console.log('Navigate to home')
}

const RightNotificationBar = ({ drawerState }) => {

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
            text: "Bryan Tan has liked your post.",
            icon: <Avatar aria-label="bryan" className={classes.avatar}>
                    B
                </Avatar>,
            path: "/",
            time: "45 minutes ago"
        },
        {
            text: "Gregg Tang has commented on your post.",
            icon: <Avatar aria-label="bryan" className={classes.avatar}>
                    G
                </Avatar>,
            path: "/",
            time: "53 minutes ago"
        },
        {
            text: "Zanden Lim has shared your post.",
            icon: <Avatar aria-label="bryan" className={classes.avatar}>
                    Z
                </Avatar>,
            path: "/",
            time: "an hour ago"
        }
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
                <ListItem>
                    <ListItemText primary={"Notifications coming soon"}></ListItemText>
                </ListItem>
                </MenuList>
            </Drawer>
        </div>
    )
}

export default RightNotificationBar
