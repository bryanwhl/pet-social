import {Grid, Container, Card,
    CardContent, Typography, 
    makeStyles, CardActions, TextField} from '@material-ui/core';

const LOGO_PATH = "http://localhost:4000/images/pet-social-logo.jpg"

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        padding: "20px",
    },
    root: {
        maxWidth: 700,
    },
    media: {
        height: 0,
        paddingTop: '90.25%', // 16:9
    },
    bookmark: {
        marginLeft: 'auto',
    },
}));

const LoginCard = () => {
    const classes = useStyles();

    return (
        <div>
            <Container className={classes.cardGrid}>
                <Grid container justify="center">
                    <Grid item>
                        <Card className={classes.root}>
                            <CardContent>
                                <Grid container spacing={1} alignItems="flex-end" justify="center">
                                    <img src={LOGO_PATH} alt="Pet Social" width="190" height="60" />
                                </Grid>
                                <Grid container spacing={1} alignItems="flex-end" justify="center">
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Sign In
                                    </Typography>
                                </Grid>
                            </CardContent>
                            <CardActions disableSpacing>
                                <Grid spacing={1} alignItems="flex-end" justify="center">
                                    <TextField 
                                        id="filled-basic" 
                                        label="Username" 
                                        variant="filled" 
                                    />
                                </Grid>
                                <Grid spacing={1} alignItems="flex-end" justify="center">
                                    <TextField
                                        id="filled-password-input"
                                        label="Password"
                                        type="password"
                                        autoComplete="current-password"
                                        variant="filled"
                                    />
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default LoginCard
