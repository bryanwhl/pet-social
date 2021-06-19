import React from 'react'
import { ListSubheader, Divider, Button, CardHeader, Typography, Card, CardContent, CardActions, ListItem, TextField, makeStyles } from '@material-ui/core';
import { deletePlaygroupQuery, getPlaygroupsQuery } from '../../queries.js';
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

const PlaygroupInfo = ({ playgroup, user }) => {
    const classes = useStyles();

    const [ deletePlaygroup, deletePlaygroupResponse ] = useMutation(deletePlaygroupQuery,{
        refetchQueries: [{query: getPlaygroupsQuery}],
    })

    const handleDelete = () => {
        deletePlaygroup({variables: {id: playgroup.id}})
    }

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
                    <Typography color="textSecondary">
                        Creator: @{playgroup.user}
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
                {user.id === playgroup.userID ? <CardActions>
                    <Button size="small" onClick={handleDelete}>
                        <Typography color="secondary">
                            Delete Playgroup
                        </Typography>
                    </Button>
                </CardActions> : null}
            </Card>
        </div>
    )
}

export default PlaygroupInfo
