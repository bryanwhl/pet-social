import React from 'react';
import { useState } from 'react';
import { IconButton,
    Paper, InputBase } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { allUsernameQuery } from '../../queries.js';
import { useQuery } from '@apollo/client';
import {
  Link,
} from "react-router-dom";

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

const SearchBar = ( {user, type, addChatFriend} ) => {

  const classes = useStyles();
  const [searchText, setSearchText] = useState("");


  const allUsers = useQuery(allUsernameQuery);

  const handleSearchChange = (event, value) => {
    console.log(value)
    setSearchText(value.username);
  };

  const handleSearchInputChange = (event, value) => {
    console.log(value)
    setSearchText(value);
  };

  const handleSubmitSearch = () => {
    if (searchText[0] === '@') {
      const resultString = searchText.slice(1);
      setSearchText(resultString)
    } else {
      setSearchText(searchText)
    }
    console.log(searchText);
    return "/profile?username=" + searchText;
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
        freeSolo
        options={allUsers.data === undefined ? null : type==="Top" ? allUsers.data.allUsers : user.friends}
        getOptionLabel={(option) => '@' + option.username}
        onChange={handleSearchChange}
        onInputChange={handleSearchInputChange}
        onKeyDown={handleKeyDown}
        clearOnEscape={type==="Chat"}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <Paper component="form" className={classes.searchBarRoot}>
              <InputBase
                className={classes.input}
                placeholder={type==="Top" ? "Search All Users" : "Search Friends"}
                inputProps={{ 'aria-label': 'search pet social' }}
                {...params.inputProps}
              />
              <IconButton component={Link} to={type==="Top" && handleSubmitSearch} onClick={type==="Chat" && handleAddChat} className={classes.iconButton} aria-label="search">
                {type==="Top" ? <SearchIcon /> : <AddIcon />}
              </IconButton>
            </Paper>
          </div>
        )}
      />
    </div>
  )
}

export default SearchBar
