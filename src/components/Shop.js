import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      marginLeft: 390,
      marginTop: 20,
    },
  }));


const Shop = () => {
    const classes = useStyles();

    return (
        <main>
            <Toolbar />
            <div className={classes.root}>
                <Typography variant='h2'>
                    Shop Coming Soon!
                </Typography>
            </div>
        </main>
    )
}

export default Shop
