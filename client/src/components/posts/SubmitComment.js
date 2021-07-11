import React from 'react'
import {TextField, makeStyles, Button, FormControl} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { submitCommentQuery, getPostsQuery } from '../../queries.js';
import { useMutation } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
    textField: {
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        marginTop: 10,
        paddingRight: 24,
        width: "68vmin"
    },
    button: {
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        width: "64vmin",
        paddingRight: 20,
        marginTop: 10,
    },
}));

const SubmitComment = ({user, post}) => {
    const classes = useStyles();

    const [comment, setComment] = React.useState({post: post.id, user: user.id, text: ""});
    const [error, setError] = React.useState(null);

    const [ submitComment, submitCommentResult ] = useMutation(submitCommentQuery, {
        refetchQueries: [{query: getPostsQuery}],
        options: {awaitRefetchQueries: true}
    }, )

    const handleChange = (prop) => (event) => {
        setComment({ ...comment, [prop]: event.target.value });
        if (comment.text !== "") {
            setError(null);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (comment.text === "") {
            setError("Comment cannot be empty!");
            return;
        }
        submitComment({
            variables: { 
                post: comment.post,
                user: comment.user,
                text: comment.text,
            }
        });
        setComment({post: post.id, user: user.id, text: ""});
    } // edit this function

    return (
        <div>
            <FormControl>
                <TextField
                    id="outlined-multiline-static"
                    label="Write a comment..."
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth="true"
                    className={classes.textField}
                    onChange={handleChange('text')}
                    value={comment.text}
                    error={["Comment cannot be empty!"].includes(error)}
                    helperText={["Comment cannot be empty!"].includes(error) ? error : ""}
                />
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    className={classes.button}
                    
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </FormControl>
        </div>
    )
}

export default SubmitComment
