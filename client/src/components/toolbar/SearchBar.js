import React from 'react';
import { useState } from 'react';
import { IconButton,
    Paper, InputBase } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { allUsernameQuery } from '../../queries.js';
import { useQuery } from '@apollo/client';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  searchBarRoot: {
    padding: '0px 12px',
    display: 'flex',
    alignItems: 'center',
    width: "100%",
  },
  input: {
    marginLeft: theme.spacing(1),
    fontSize:17,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  resize:{
    fontSize:50
  },
}));

const SearchBar = ( {user, type, history, addChatFriend} ) => {
  const classes = useStyles();

  // State variables for Search Bar
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // Queries to get all usernames
  const allUsers = useQuery(allUsernameQuery);

  const handleSearchChange = (event, value) => {
    console.log(value)
    if (value!==null && value.username!==null && value.username!==undefined) {
      setSearchText(value.username);
    } else {
      setSearchText('');
    }
  };

  // Submit search query and navigate to profile
  const handleSubmitSearch = () => {
    if (searchText==='') {
      handleClick();
      return;
    }
    if (searchText[0] === '@') {
      const resultString = searchText.slice(1);
      setSearchText(resultString)
    } else {
      setSearchText(searchText)
    }
    console.log(searchText);
    const finalString = '/profile?username=' + searchText
    history.push(finalString)
  }

  const handleAddChat = () => {
    if (searchText[0] === '@') {
      const resultString = searchText.slice(1);
      setSearchText(resultString)
    } else {
      setSearchText(searchText)
    }
    if (searchText !== "") {
      const friendToAdd = user.friends.find(friend => friend.username === searchText)
      addChatFriend(friendToAdd)
    }
  }

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
        type==="Top" ? handleSubmitSearch() : handleAddChat()
    }
}

  return (
    <div>
      <Autocomplete
        id="custom-input-demo"
        options={allUsers.data === undefined ? null : type==="Top" ? allUsers.data.allUsers : user.friends}
        getOptionLabel={(option) => '@' + option.username}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        clearOnEscape={type==="Chat"}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <Paper className={classes.searchBarRoot}>
              <InputBase
                className={classes.input}
                placeholder={type==="Top" ? "Search All Users" : "Search Friends"}
                inputProps={{ 'aria-label': 'search pet social' }}
                {...params.inputProps}
              />
              <IconButton onClick={type==="Chat" ? handleAddChat : handleSubmitSearch} className={classes.iconButton} aria-label="search">
                {type==="Top" ? <SearchIcon /> : <AddIcon />}
              </IconButton>
            </Paper>
          </div>
        )}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Please select a valid username!"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="secondary" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  )
}

export default SearchBar
