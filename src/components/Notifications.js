import React from 'react'
import { IconButton, Badge, makeStyles, Avatar, Popper, ListItem, ListItemIcon, ListItemText, Grow, Paper, ClickAwayListener, MenuList } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  avatar: {
      backgroundColor: red[500],
  }
}));

const Notifications = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const menuItems = [
    {
      text: "Bryan Wong liked your post.",
      icon: <Avatar aria-label="bryan" className={classes.avatar}>
              B
            </Avatar>,
      path: "/",
      time: "45 minutes ago"
    },
    {
      text: "Benedict Tan has commented on your post.",
      icon: <Avatar aria-label="bryan" className={classes.avatar}>
              B
            </Avatar>,
      path: "/",
      time: "53 minutes ago"
    },
    {
      text: "Brendan Lim has shared your post.",
      icon: <Avatar aria-label="bryan" className={classes.avatar}>
              B
            </Avatar>,
      path: "/",
      time: "an hour ago"
    }
  ]

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);


  return (
    <div>
      <IconButton
      ref={anchorRef}
      aria-controls={open ? 'menu-list-grow' : undefined}
      aria-haspopup="true"
      onClick={handleToggle}
      >
        <Badge badgeContent={menuItems.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
      {({ TransitionProps, placement }) => (
          <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
          <Paper>
              <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {menuItems.map(item => (
                      <ListItem
                          button
                          key={item.text}
                          onClick={handleClose}
                      >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.text} secondary={item.time}></ListItemText>
                      </ListItem>
                  ))}
              </MenuList>
              </ClickAwayListener>
          </Paper>
          </Grow>
      )}
      </Popper>
    </div>
  )
}

export default Notifications
