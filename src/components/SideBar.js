import { Drawer, IconButton, Divider } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import MapIcon from '@material-ui/icons/Map';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const drawerWidth = 240;

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
  }
}));

const SideBar = ({ drawerState, closeDrawer, accountType, switchToHome }) => {
    
    const handleNewsClick = () => {
        console.log('Navigate to news')
    }
    
    const handlePlaygroupsClick = () => {
        console.log('Navigate to playgroups')
    }
    
    const handleAdvertisingClick = () => {
        console.log('Navigate to advertising')
    }
    
    const handleShopClick = () => {
        console.log('Navigate to shop')
    }
    
    const handleSettingsClick = () => {
        console.log('Navigate to settings')
    }

    const sidebarItems = [
        {
            text: "Home",
            icon: <HomeIcon/>,
            path: "/",
            onClick: switchToHome
        },
        {
            text: "News Feed",
            icon: <AnnouncementIcon />,
            path: "/",
            onClick: handleNewsClick
        },
        {
            text: (accountType === "Personal") ? "Playgroups" : "Advertising",
            icon: (accountType === "Personal") ? <MapIcon /> : <MonetizationOnIcon />,
            path: "/",
            onClick: (accountType === "Personal") ? handlePlaygroupsClick : handleAdvertisingClick
        },
        {
            text: (accountType === "Personal") ? "Shop" : "Your Store",
            icon: <LocalMallIcon />,
            path: "/",
            onClick: handleShopClick
        }
    ]

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant='persistent'
                anchor='left'
                open={drawerState}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                <IconButton onClick={closeDrawer}>
                    {<ChevronLeftIcon />}
                </IconButton>
                </div>                
                <Divider />
                <div className={classes.drawerContainer}>
                <List>
                    {sidebarItems.map(item => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={item.onClick}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}></ListItemText>
                        </ListItem>
                    ))}
                    <Divider/>
                    <ListItem button key ='Settings' onClick={handleSettingsClick}>
                        <ListItemIcon>
                            <SettingsIcon/>
                        </ListItemIcon>
                        <ListItemText primary='Settings'/>
                    </ListItem>
                </List>
                
                </div>
            </Drawer>
        </div>
    )
}

export default SideBar
