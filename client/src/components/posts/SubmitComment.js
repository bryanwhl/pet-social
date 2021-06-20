import React from 'react'
import {TextField, makeStyles, Button, FormControl} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { submitCommentQuery, getPostsQuery } from '../../queries.js';
import { useMutation } from '@apollo/client';

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

    const [comment, setComment] = React.useState({post: post.id, user: user.id, text: ""});

    const [ submitComment, submitCommentResult ] = useMutation(submitCommentQuery, {
        refetchQueries: [{query: getPostsQuery}],
        options: {awaitRefetchQueries: true}
    }, )

    const handleChange = (prop) => (event) => {
        setComment({ ...comment, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
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
                />
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    className={classes.button}
                    fullWidth="true"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </FormControl>
        </div>
    )
}

export default SubmitComment
