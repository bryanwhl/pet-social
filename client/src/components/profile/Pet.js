import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      marginLeft: "20vw",
      marginRight: "20vw",
      marginTop: 20,
      height: "100vh",
      zIndex: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
    input: {
      display: "none"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));

const Pet = ({ user, pet, isAddPet }) => {
  const classes=useStyles();
    return (
        <div>
            <CssBaseline>
                {isAddPet ? 
                "Add Pet Screen" :
                "Show Pet Screen"}
            </CssBaseline>
        </div>
    )
}

export default Pet
