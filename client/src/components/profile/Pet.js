import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import { List, ListItem, ListItemAvatar, ListItemText, ListItemIcon } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import { displayName, convertDate } from '../../utility.js'
import { useLazyQuery, useMutation } from '@apollo/client'
import { getPetByIdQuery, addPetOwnerQuery } from '../../queries.js'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexGrow: 1,
      marginTop: 20,
      width: "50vmin",
      height: "40vh",
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
    avatar: {
      backgroundColor: red[500],
      width: theme.spacing(15),
      height: theme.spacing(15),
      marginRight: "3vw"
    },
  }));

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Pet = ({ user, petId, isAddPet }) => {
  const classes=useStyles();

  const [addOwner, setAddOwner] = useState("")
  const [openOwner, setOpenOwner] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [error, setError] = useState(null);
  const [pet, setPet] = useState(null)
  const [getPet, getPetResponse] = useLazyQuery(getPetByIdQuery, {
    fetchPolicy: "no-cache"
  })
  const [ addPetOwner, addPetOwnerResponse ] = useMutation(addPetOwnerQuery, {
    onError: (error) => {
        console.log(error.graphQLErrors[0])
      setError(error.graphQLErrors[0].message)
     }
})

useEffect(() => {
  if ( addPetOwnerResponse.data ) {
      if (!error) {
          handleCloseOwner();
          handleOpenSnackbar("New Owner Added")
          getPet({variables: {id: pet.id}})
      }
  }
}, [addPetOwnerResponse.data])

  useEffect(() => {
    if (getPetResponse.data) {
      console.log("Pet, ", getPetResponse.data)
      setPet(getPetResponse.data.findPet)
    }
  }, [getPetResponse.data])

  useEffect(() => {
    if (petId) {
      console.log(petId)
      getPet({variables: {id: petId}})
    }
  }, [petId])

const handleCloseSnackbar = () => {
  setOpenSnackbar(null)
}

const handleOpenSnackbar = (input) => {
  console.log(input)
  setOpenSnackbar(input)
}

const handleChangeOwner = () => (event) => {
  setAddOwner(event.target.value);
};

const handleConfirmOwner = () => {
  setError(null)
  addPetOwner({variables: {id: pet.id, username: addOwner}});
}

const handleOpenOwner = () => {
  setOpenOwner(true);
  setError(null);
}

const handleCloseOwner = () => {
  setOpenOwner(false);
  setAddOwner("")
}

    return (
        <div>
            <CssBaseline>
                {isAddPet && "Add Pet Screen"}
                {(!isAddPet && pet) &&
                  <Grid container className={classes.root}>
                    <Avatar alt="Avatar" src={pet.picturePath} className={classes.avatar}>
                        {pet.name[0]}
                    </Avatar>
                    <Grid item xs>
                        <Typography variant="h4" gutterBottom>
                          {pet.name}
                        </Typography>
                        <Typography variant="h5">
                          {pet.gender}{" "}{pet.breed}
                        </Typography>
                        <Typography variant="body1">
                          Born: {convertDate(pet.dateOfBirth)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5">Owners</Typography>
                      <List>
                      {pet.owners.map(item => (
                          <ListItem item style={{cursor: "pointer"}} button>
                            <ListItemAvatar>
                              <Avatar alt={"Owner Avatar"} src={item.avatarPath}/>
                            </ListItemAvatar>
                            <ListItemText>
                              {displayName(item)}{item.id===user.id && " (You)"}
                            </ListItemText>
                          </ListItem>
                      ))}
                      <ListItem button onClick={handleOpenOwner}>
                        <ListItemIcon><AddIcon/></ListItemIcon>
                        <ListItemText primary="Add Owner"></ListItemText>
                      </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                }
            </CssBaseline>
            <Dialog
                open={openOwner}
                onClose={handleCloseOwner}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Add another owner"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Please enter the username of the new owner
                </DialogContentText>
                <TextField
                    error={["User does not exist", "User is already an owner"].includes(error)}
                    helperText={["User does not exist", "User is already an owner"].includes(error) ? error : ""}
                    autoFocus
                    margin='dense'
                    label="Add Owner Username"
                    fullWidth
                    onChange={handleChangeOwner()}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleConfirmOwner} color="primary" disabled={addOwner===""}>
                    Add
                </Button>
                <Button onClick={handleCloseOwner} color="primary" autoFocus>
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {openSnackbar}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Pet
