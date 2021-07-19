import React from 'react';
import { useState } from 'react';
import { IconButton,
    Paper, InputBase } from '@material-ui/core';
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
  root: {
      display: "flex"
  },
  appBar: {
      zIndex: theme.zIndex.drawer + 2,
  },
  avatar: {
      backgroundColor: red[500],
  },
  rightPopper: {
      zIndex: theme.zIndex.drawer + 1,
      width: '200px',
  },
  customizeToolbar: {
      height: "4vh"
  },
  searchBarRoot: {
    padding: '2px 12px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    fontSize:17,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  resize:{
    fontSize:50
  },
}));

const SearchBar = () => {

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

  return (
    <div>
      <Autocomplete
        id="custom-input-demo"
        freeSolo
        options={allUsers.data === undefined ? null : allUsers.data.allUsers}
        getOptionLabel={(option) => '@' + option.username}
        onChange={handleSearchChange}
        onInputChange={handleSearchInputChange}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <Paper component="form" className={classes.searchBarRoot}>
              <InputBase
                className={classes.input}
                placeholder="Search Users"
                inputProps={{ 'aria-label': 'search pet social' }}
                {...params.inputProps}
              />
              <IconButton component={Link} to={handleSubmitSearch} className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </div>
        )}
      />
    </div>
  )
}

export default SearchBar
