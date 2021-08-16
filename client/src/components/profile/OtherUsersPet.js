import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { displayName, convertDate } from '../../utility.js'
import { useLazyQuery } from '@apollo/client'
import { getPetByIdQuery } from '../../queries.js'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    marginTop: 20,
    width: "50vmin",
    height: "40vh",
    zIndex: 1,
  },
  avatar: {
    backgroundColor: red[500],
    width: theme.spacing(18),
    height: theme.spacing(18),
  }
}));

const Pet = ({ user, petId, setPetId, setPetMode }) => {
  const classes = useStyles();

  // Queries for getting pet data from server
  const [pet, setPet] = useState(null)
  const [getPet, getPetResponse] = useLazyQuery(getPetByIdQuery, {
    fetchPolicy: "no-cache"
  })
  
  // Setter function
  useEffect(() => {
    if (getPetResponse.data) {
      setPet(getPetResponse.data.findPet)
    }
  }, [getPetResponse.data])

  // Getter function
  useEffect(() => {
    if (petId) {
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
