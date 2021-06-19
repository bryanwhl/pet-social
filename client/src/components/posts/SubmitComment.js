import React from 'react'
import {TextField, makeStyles, Button, IconButton} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
    textField: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: "68vmin"
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: "68vmin",
        marginTop: 10,
    },
}));

const SubmitComment = ({user, post}) => {
    const classes = useStyles();

    return (
        <div>
            <TextField
                id="outlined-multiline-static"
                label="Write a comment..."
                multiline
                rows={4}
                variant="outlined"
                fullWidth="true"
                className={classes.textField}
            />
            <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                className={classes.button}
                fullWidth="true"
            >
                Submit
            </Button>
        </div>
    )
}

export default SubmitComment
