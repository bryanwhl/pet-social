import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import { useMutation } from '@apollo/client'
import { addPetQuery, currentUserQuery, UPLOAD_FILE } from '../../queries.js'


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexGrow: 1,
      marginTop: 20,
      width: "70vmin",
      height: "70vh",
      marginTop: "5vh",
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
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
}));

const AddPet = ({ user, setPet, setPetMode, getCurrentUser }) => {
    const classes=useStyles();

    const [avatarPath, setAvatarPath] = useState("")
    const [error, setError] = useState(null)
    const [profileBadge, setProfileBadge] = useState(true);
    const [details, setDetails] = useState({name:"", gender:"", breed:"", dateOfBirth:null});

    const genders = ["Male", "Female"]

    const [ addPet, addPetResponse ] = useMutation(addPetQuery, {
      onError: (error) => {
        setError(error.graphQLErrors[0].message)
      }}, {refetchQueries: [{query: currentUserQuery}]})
    const [ uploadFile, uploadFileResponse ] = useMutation(UPLOAD_FILE)

    useEffect(() => {
      if ( uploadFileResponse.data ) {
        setAvatarPath(uploadFileResponse.data.uploadFile.url)
      }
    }, [uploadFileResponse.data])

    useEffect(() => {
      if ( addPetResponse.data ) {
        if (!error) {
          setPet(addPetResponse.data.addPet.id)
          setPetMode(false)
          getCurrentUser();
        }
      }
    }, [addPetResponse.data])

    const handleSubmit = event => {
        event.preventDefault();
        addPet({ variables: { name: details.name, owner: user.id, gender: details.gender, breed: details.breed, dateOfBirth: details.dateOfBirth, picturePath: avatarPath } })
        setError(null)
    }

    const handleChange = (prop) => (event) => {
        setDetails({ ...details, [prop]: event.target.value });
    };

    const handleDateChange = (date) => {
        setDetails({ ...details, dateOfBirth: date});
      };

    const handleAvatarChange = (event) => {
      const file = event.target.files[0]
      uploadFile({variables: {file}});
    }

    return (
        <div>
            <CssBaseline>
                <Grid container className={classes.root} justify="center">
                    <Grid item xs={10}>
                        <Typography align="center" variant="h4">Add Pet</Typography>
                    </Grid>
                    <Grid>
                      <input accept="image/*" className={classes.input} id="pet-avatar" type="file" onChange={handleAvatarChange} />
                      <label htmlFor="pet-avatar">
                      <IconButton aria-label="change profile picture" component="span" onMouseEnter={() => setProfileBadge(false)} onMouseLeave={() => setProfileBadge(true)}>
                      <Badge
                        invisible={profileBadge}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        badgeContent={<EditIcon/>}
                      >
                        <Avatar alt="Avatar" src={avatarPath} className={classes.avatar}/>
                      </Badge>
                      </IconButton>
                      </label>
                    </Grid>
                    <Grid item xs={10}>

                      <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  onChange={handleChange('name')}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="breed"
                  label="Breed"
                  name="breed"
                  onChange={handleChange('breed')}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="gender"
                  label="Gender"
                  select
                  value={details.gender}
                  id="gender"
                  onChange={handleChange('gender')}
                >
                  {genders.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <Tooltip title="You may type the date or select from the calendar" placement="right" arrow>
                  <Grid>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                          error={error==="Date of Birth cannot be after today"}
                          helperText={error==="Date of Birth cannot be after today" ? error : ""}
                          disableToolbar
                          fullWidth
                          variant="outlined"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="Date of Birth"
                          value={details.dateOfBirth}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                              'aria-label': 'change date',
                          }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Tooltip>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={[details.name, details.breed, details.gender].includes("") || details.dateOfBirth===null}
                >
                  Add Pet
                </Button>
              </form>
                    </Grid>
                </Grid>
            </CssBaseline>
        </div>
    )
}

export default AddPet


