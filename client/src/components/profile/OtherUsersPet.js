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
import { getPetByIdQuery, addPetOwnerQuery, currentUserQuery, editPetPictureQuery, UPLOAD_FILE } from '../../queries.js'

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
      width: theme.spacing(18),
      height: theme.spacing(18),
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

  const [pet, setPet] = useState(null)
  const [getPet, getPetResponse] = useLazyQuery(getPetByIdQuery, {
    fetchPolicy: "no-cache"
  })
  
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

    return (
        <div>
            <CssBaseline>
                {(pet) &&
                  <Grid container column className={classes.root} spacing={1}>
                    <Grid item>
                      <Avatar alt="Avatar" src={pet.picturePath} className={classes.avatar}>
                          {pet.name[0]}
                      </Avatar>
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
                          <ListItem item>
                            <ListItemAvatar>
                              <Avatar alt={"Owner Avatar"} src={item.avatarPath}/>
                            </ListItemAvatar>
                            <ListItemText>
                              {displayName(item)}{item.id===user.id && " (You)"}
                            </ListItemText>
                          </ListItem>
                      ))}
                      </List>
                    </Grid>
                  </Grid>
                }
            </CssBaseline>
        </div>
    )
}

export default Pet
