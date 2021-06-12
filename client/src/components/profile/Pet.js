import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemAvatar, ListItemText, ListItemIcon } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import { displayName, convertDate } from '../../utility.js'
import { useLazyQuery } from '@apollo/client'
import { getPetByIdQuery } from '../../queries.js'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexGrow: 1,
      marginRight: "20vw",
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

const Pet = ({ user, petId, isAddPet }) => {
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
                      <ListItem button>
                        <ListItemIcon><AddIcon/></ListItemIcon>
                        <ListItemText primary="Add Owner"></ListItemText>
                      </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                }
            </CssBaseline>
        </div>
    )
}

export default Pet
