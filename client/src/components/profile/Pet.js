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
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import { List, ListItem, ListItemAvatar, ListItemText, ListItemIcon } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import { displayName, convertDate } from '../../utility.js'
import { useLazyQuery, useMutation } from '@apollo/client'
import { getPetByIdQuery, addPetOwnerQuery, deleteOwnerQuery, currentUserQuery, deletePetQuery, editPetPictureQuery, UPLOAD_FILE } from '../../queries.js'

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
    },
    button: {
      marginTop: "1vh"
    }
  }));

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Pet = ({ user, petId, setPetId, setPetMode }) => {
  const classes=useStyles();

  const [profileBadge, setProfileBadge] = useState(true);
  const [addOwner, setAddOwner] = useState("")
  const [openOwner, setOpenOwner] = useState(false)
  const [openRemoveOwner, setRemoveOwner] = useState(false)
  const [openDeletePet, setOpenDeletePet] = useState(false)
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
  const [ deleteOwner ] = useMutation(deleteOwnerQuery, {refetchQueries: [{query: currentUserQuery}], options: {awaitRefetchQueries: true}})
  const [ deletePet ] = useMutation(deletePetQuery, {refetchQueries: [{query: currentUserQuery}], options: {awaitRefetchQueries: true}})
  const [ editPetPicture, editPetPictureResponse ] = useMutation(editPetPictureQuery)
  const [ uploadFile, uploadFileResponse ] = useMutation(UPLOAD_FILE)

  useEffect(() => {
    if ( uploadFileResponse.data ) {
      editPetPicture({variables: {id: pet.id, picturePath: uploadFileResponse.data.uploadFile.url}})
    }
  }, [uploadFileResponse.data])

  useEffect(() => {
    if ( editPetPictureResponse.data ) {
      getPet({variables: {id: petId}})
    }
  }, [editPetPictureResponse.data])

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

const handleOpenRemoveOwner = () => {
  setRemoveOwner(true)
}

const handleCloseRemoveOwner = () => {
  setRemoveOwner(false)
}

const handleConfirmRemoveOwner = () => {
  deleteOwner({variables: {owner: user.id, pet: pet.id}})
  setPetId(null)
  setPetMode(null)
  handleCloseRemoveOwner()
}

const handleOpenDeletePet = () => {
  setOpenDeletePet(true)
}

const handleCloseDeletePet = () => {
  setOpenDeletePet(false)
}

const handleConfirmDeletePet = () => {
  deletePet({variables: {id: pet.id}})
  setPetId(null)
  setPetMode(null)
  handleCloseDeletePet()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  uploadFile({variables: {file}});
}

    return (
        <div>
            <CssBaseline>
                {(pet) &&
                  <Grid container className={classes.root} spacing={1}>
                    <Grid>
                      <input accept="image/*" className={classes.input} id="change-pet-avatar" type="file" onChange={handleAvatarChange} />
                      <label htmlFor="change-pet-avatar">
                      <IconButton aria-label="change profile picture" component="span" onMouseEnter={() => setProfileBadge(false)} onMouseLeave={() => setProfileBadge(true)}>
                      <Badge
                        invisible={profileBadge}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        badgeContent={<EditIcon/>}
                      >
                      <Avatar alt="Avatar" src={pet.picturePath} className={classes.avatar}>
                          {pet.name[0]}
                      </Avatar>
                      </Badge>
                      </IconButton>
                      </label>
                    </Grid>
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
                      <Tooltip title="Cannot remove only owner. You may want delete the pet instead" disableHoverListener={pet.owners.length!==1} disableTouchListener={pet.owners.length!==1}>
                        <Grid>
                          <Button className={classes.button} variant="contained" color="primary" onClick={ handleOpenRemoveOwner } disabled={pet.owners.length===1}>Remove self as owner</Button>
                        </Grid>
                      </Tooltip>
                        <Grid>
                          <Button className={classes.button} variant="contained" color="primary" onClick={ handleOpenDeletePet }>Delete Pet</Button>
                        </Grid>
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
            <Dialog
                open={openRemoveOwner}
                onClose={handleCloseRemoveOwner}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to remove yourself as owner?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleConfirmRemoveOwner} color="primary">
                    Yes
                </Button>
                <Button onClick={handleCloseRemoveOwner} color="primary" autoFocus>
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDeletePet}
                onClose={handleCloseDeletePet}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to remove {pet && pet.name}? This removes your pet completely, including from other owners!
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleConfirmDeletePet} color="primary">
                    Yes
                </Button>
                <Button onClick={handleCloseDeletePet} color="primary" autoFocus>
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
