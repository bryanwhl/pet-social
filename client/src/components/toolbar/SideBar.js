import { Drawer } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import MapIcon from '@material-ui/icons/Map';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import SettingsIcon from '@material-ui/icons/Settings';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { useHistory, useRouteMatch } from "react-router-dom";

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
  }
}));

const SideBar = ({ drawerState, closeLeftDrawer, setRightDrawerState, accountType }) => {
    
    let history = useHistory();
    let { url } = useRouteMatch();

    // Navigate to home
    const switchToHome = () => {
        history.push('/home')
    }
    
    // Navigate to playgroups
    const switchToPlaygroups = () => {
        history.push('/playgroups')
        closeLeftDrawer()
        setRightDrawerState("false")
    }
    
    // Navigate to advertising
    const handleAdvertisingClick = () => {
        console.log('Navigate to advertising')
    }
    
    // Navigate to shop
    const switchToShop = () => {
        history.push('/shop')
    }
    
    // Navigate to settings
    const switchToSettings = () => {
        history.push('/settings')
        closeLeftDrawer()
    }

    const sidebarItems = [
        {
            text: "Home",
            icon: <HomeIcon/>,
            path: "/",
            selected: (url === "home"),
            onClick: switchToHome
        },
        {
            text: (accountType === "Personal") ? "Playgroups" : "Advertising",
            icon: (accountType === "Personal") ? <MapIcon /> : <MonetizationOnIcon />,
            path: "/",
            selected: (url === "playgroups"),
            onClick: (accountType === "Personal") ? switchToPlaygroups : handleAdvertisingClick
        },
        {
            text: (accountType === "Personal") ? "Shop" : "Your Store",
            icon: <LocalMallIcon />,
            path: "/",
            selected: (url === "shop"),
            divider: true,
            onClick: switchToShop
        },
        {
            text: "Settings",
            icon: <SettingsIcon />,
            path: "/",
            selected: (url === "settings"),
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
                <div className={classes.toolbar} />
                <List disablePadding>
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
            </Drawer>
        </div>
    )
}

export default SideBar
