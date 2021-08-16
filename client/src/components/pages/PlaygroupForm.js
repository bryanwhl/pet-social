import React from 'react'
import { FormControl, ListSubheader, Button, List, ListItem, TextField, makeStyles } from '@material-ui/core';
import { submitPlaygroupQuery, getPlaygroupsQuery } from '../../queries.js';
import { useMutation } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 270,
  }
}));

const PlaygroupForm = ({user, meetingLocation}) => {
    const classes = useStyles();

    // State variables for playgroup form
    const [playgroup, setPlaygroup] = React.useState({playgroupAdmin: user.id, name:"", description:"", meetingLat: meetingLocation[0], meetingLng: meetingLocation[1], meetingDate:"",});
    const [error, setError] = React.useState(false);

    // Query for submitting new playgroup
    const [ submitPlaygroup, submitPlaygroupResult ] = useMutation(submitPlaygroupQuery, {
        refetchQueries: [{query: getPlaygroupsQuery}],
    })

    const handleChange = (prop) => (event) => {
        setPlaygroup({ ...playgroup, [prop]: event.target.value });
        setError(false);
    };

    // Submits the add playgroup form
    const handleSubmit = (event) => {
        event.preventDefault();

        if (playgroup.name === "") {
            setError(true);
            console.log(error);
            if (error === true) {
                return;
            }
        } else if (playgroup.meetingDate === "") {
            setError(true);
            console.log(error);
            if (error === true) {
                return;
            }
        } else if (playgroup.description === "") {
            setError(true);
            console.log(error);
            if (error === true) {
                return;
            }
        } else {
            submitPlaygroup({
                variables: { 
                    playgroupAdmin: playgroup.playgroupAdmin,
                    description: playgroup.description,
                    name: playgroup.name, 
                    meetingLat: playgroup.meetingLat, 
                    meetingLng: playgroup.meetingLng, 
                    meetingDate: playgroup.meetingDate 
                }
            });
        }
    }

    return (
        <div>
            <FormControl className={classes.container}>
                <List subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    Create a Playgroup!
                    </ListSubheader>
                }>
                    <ListItem>
                        <TextField 
                            id="name-of-playgroup" 
                            label="Name Of Playgroup" 
                            variant="outlined" 
                            className={classes.textField} 
                            onChange={handleChange('name')}
                            error={error === true && playgroup.name === ""}
                            helperText={error === true ? "Name cannot be empty!" : null}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            id="date-of-meeting"
                            label="Date Of Meeting" 
                            type="datetime-local"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            onChange={handleChange('meetingDate')}
                            error={error === true && playgroup.meetingDate === ""}
                            helperText={error === true ? "Date cannot be empty!" : null}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField 
                            id="details" 
                            label="Details" 
                            variant="outlined" 
                            className={classes.textField} 
                            onChange={handleChange('description')}
                            error={error === true && playgroup.description === ""}
                            helperText={error === true ? "Description cannot be empty!" : null}
                        />
                    </ListItem>
                    <ListItem style={{display:'flex', justifyContent:'flex-end'}}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </ListItem>
                </List>
            </FormControl>
        </div>
    )
}

export default PlaygroupForm
