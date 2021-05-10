import { Drawer, IconButton, Divider } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import MapIcon from '@material-ui/icons/Map';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

const handleHomeClick = () => {
    console.log('Navigate to home')
}

const handleNewsClick = () => {
    console.log('Navigate to news')
}

const handlePlaygroupsClick = () => {
    console.log('Navigate to playgroups')
}

const handleShopClick = () => {
    console.log('Navigate to shop')
}

const handleSettingsClick = () => {
    console.log('Navigate to settings')
}

const SideBar = ({ drawerState, closeDrawer }) => {

    const classes = useStyles();

    return (
        <div>
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
                    <ListItem button key='Home' onClick={handleHomeClick}>
                        <ListItemIcon>
                            <HomeIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItem>
                    <ListItem button key='News Feed' onClick={handleNewsClick}>
                        <ListItemIcon>
                            <AnnouncementIcon/>
                        </ListItemIcon>
                        <ListItemText primary="News Feed"/>
                    </ListItem>
                    <ListItem button key='Playgroups' onClick={handlePlaygroupsClick}>
                        <ListItemIcon>
                            <MapIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Playgroups"/>
                    </ListItem>
                    <ListItem button key='Shop' onClick={handleShopClick}>
                        <ListItemIcon>
                            <LocalMallIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Shop"/>
                    </ListItem>
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
