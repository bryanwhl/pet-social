import React from 'react'
import {Grid, Container, Card, IconButton, 
    Avatar, CardHeader, makeStyles, CardActions, 
    } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        padding: "20px",
    },
    root: {
        maxWidth: 300,
    },
    avatar: {
        backgroundColor: red[500],
    }
}));

const FriendRequest = () => {
    const classes = useStyles();

    return (
        <div>
            <Container className={classes.cardGrid}>
                <Grid container>
                    <Grid item>
                        <Card className={classes.root}>
                            <CardHeader
                                avatar={
                                <Avatar aria-label="bryan" className={classes.avatar}>
                                    C
                                </Avatar>
                                }
                                action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                                }
                                title="Carol Tan has sent you a friend request!"
                            />
                            <CardActions>
                                <CheckCircleIcon />
                                <CancelIcon />
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default FriendRequest
