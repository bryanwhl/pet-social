import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Post from '../posts/Post.js'
import { useLazyQuery } from '@apollo/client'
import { getPostByIdQuery } from '../../queries.js'

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  const useStyles = makeStyles((theme) => ({
    card: {
      minWidth: 240
    },
    media: {
      paddingTop: '100%', // 16:9
    },
    dialog: {
      width: "75vmin"
    },
  }));

const ProfileTabs = ({ user, profileTab, handleProfileTabChange }) => {
    const classes=useStyles();
    
    const [postOpen, setPostOpen] = useState(false);
    const [backdropPost, setBackdropPost] = useState(null);

    const [getQueryPost, queryPost] = useLazyQuery(getPostByIdQuery, {
        fetchPolicy: "no-cache"
    })

    useEffect(() => {
        if (queryPost.data) {
          setBackdropPost(queryPost.data.findPost)
        }
    }, [queryPost.data])

    const handleOpenPost = (item) => {
        setPostOpen(true);
        const id = item.id
        getQueryPost({variables: {id}})
    };

    const handleClosePost = () => {
        setPostOpen(false);
        setBackdropPost(null)
    };

    return (
        <div>
            <Tabs
              value={profileTab}
              onChange={handleProfileTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Posts" />
              <Tab label="Tagged" />
              <Tab label="Saved" />
            </Tabs>
            <TabPanel value={profileTab} index={0}>
              <Grid container spacing={2} justify="center">
                {user.posts.map(item => (
                    <Grid item style={{cursor: "pointer"}} onClick={() => handleOpenPost(item)}>
                      <Card className={classes.card}>
                        <CardMedia className={classes.media} image={item.imageFilePath} title="Post"/>
                      </Card>
                    </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={profileTab} index={1}>
              <Grid container spacing={2} justify="center">
                Tagged Posts Coming Soon
              </Grid>
            </TabPanel>
            <TabPanel value={profileTab} index={2}>
              <Grid container spacing={2} justify="center">
                {user.savedPosts.map(item => (
                    <Grid item style={{cursor: "pointer"}} onClick={() => handleOpenPost(item)}>
                      <Card className={classes.card}>
                        <CardMedia className={classes.media} image={item.imageFilePath} title="Post"/>
                      </Card>
                    </Grid>
                ))}
              </Grid>
            </TabPanel>
            <Dialog onClose={handleClosePost} open={postOpen} scroll={"body"} fullWidth
            PaperProps={{
                style: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
                maxWidth: "75vmin"
                },
            }}>
                {backdropPost && <Post user={user} post={backdropPost}/>}
            </Dialog>
        </div>
    )
}

export default ProfileTabs
