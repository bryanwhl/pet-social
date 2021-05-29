import { Drawer, IconButton, Divider } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import MapIcon from '@material-ui/icons/Map';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    paddingTop: 7,
    width: drawerWidth,
  },
  root: {
      display: 'flex',
  }
}));

const SideBar = ({ drawerState, closeLeftDrawer, setRightDrawerState, accountType, appState, setAppState }) => {
    
    const switchToHome = () => {
        setAppState("Home")
    }
    
    const switchToPlaygroups = () => {
        setAppState("Playgroups")
        closeLeftDrawer()
        setRightDrawerState("false")
    }
    
    const handleAdvertisingClick = () => {
        console.log('Navigate to advertising')
    }
    
    const switchToShop = () => {
        setAppState("Shop")
    }
    
    const switchToSettings = () => {
        setAppState("Settings")
        closeLeftDrawer()
    }

    const sidebarItems = [
        {
            text: "Home",
            icon: <HomeIcon/>,
            path: "/",
            selected: (appState === "Home"),
            onClick: switchToHome
        },
        {
            text: (accountType === "Personal") ? "Playgroups" : "Advertising",
            icon: (accountType === "Personal") ? <MapIcon /> : <MonetizationOnIcon />,
            path: "/",
            selected: (appState === "Playgroups"),
            onClick: (accountType === "Personal") ? switchToPlaygroups : handleAdvertisingClick
        },
        {
            text: (accountType === "Personal") ? "Shop" : "Your Store",
            icon: <LocalMallIcon />,
            path: "/",
            selected: (appState === "Shop"),
            divider: true,
            onClick: switchToShop
        },
        {
            text: "Settings",
            icon: <SettingsIcon />,
            path: "/",
            selected: (appState === "Settings"),
            onClick: switchToSettings
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
                <IconButton onClick={closeLeftDrawer}>
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
        </div>
    )
}

export default SideBar
