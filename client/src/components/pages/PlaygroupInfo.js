import React from 'react'
import { ListSubheader, Divider, Button, CardHeader, Typography, Card, CardContent, CardActions, ListItem, TextField, makeStyles } from '@material-ui/core';
import { submitPlaygroupQuery } from '../../queries.js';
import { useMutation } from '@apollo/client';
import { convertDate, convertTime } from '../../utility.js';

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "270px"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const PlaygroupForm = ({ playgroup }) => {
    const classes = useStyles();

    return (
        <div>
            <Card flat tile elevation={0} className={classes.container}>
                <CardHeader
                    title={playgroup.name}
                />
                <Divider />
                <CardContent>
                    <Typography>
                        Meeting Details:
                    </Typography>
                    <Typography color="textSecondary">
                        Date: {convertDate(playgroup.date)}
                    </Typography>
                    <Typography color="textSecondary">
                        Time: {convertTime(playgroup.date)}
                    </Typography>
                </CardContent>
                <Divider />
                <CardContent>
                    <Typography>
                        Description:
                    </Typography>
                    <Typography color="textSecondary">
                        {playgroup.description}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default PlaygroupForm
