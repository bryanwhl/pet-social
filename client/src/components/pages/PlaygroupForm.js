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
  },
}));

const PlaygroupForm = ({user, meetingLocation}) => {
    const classes = useStyles();

    const [playgroup, setPlaygroup] = React.useState({playgroupAdmin: user.id, name:"", description:"", meetingLat: meetingLocation[0], meetingLng: meetingLocation[1], meetingDate:"",});

    const [ submitPlaygroup, submitPlaygroupResult ] = useMutation(submitPlaygroupQuery, {
        refetchQueries: [{query: getPlaygroupsQuery}],
    })

    console.log(meetingLocation);

    const handleChange = (prop) => (event) => {
        setPlaygroup({ ...playgroup, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
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

    return (
        <div>
            <FormControl className={classes.container}>
                <List subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    Create a Playgroup!
                    </ListSubheader>
                }>
                    <ListItem>
                        <TextField id="name-of-playgroup" label="Name Of Playgroup" variant="outlined" className={classes.textField} onChange={handleChange('name')}/>
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
                        />
                    </ListItem>
                    <ListItem>
                        <TextField id="details" label="Details" variant="outlined" className={classes.textField} onChange={handleChange('description')}/>
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
