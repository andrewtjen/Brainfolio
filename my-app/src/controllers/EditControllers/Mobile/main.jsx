import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import { withRouter, Route  } from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import SlideLayout from "../Mobile/SlideLayout";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    color: theme.palette.secondary.main,
    textAlign: "center",
    fontWeight: 700
  },
  subtitle: {
    color: theme.palette.text.secondary,
    textAlign:"center",
    display: "block",
    marginBottom: theme.spacing(2)
  },
  editItem: {
    maxWidth : 120,
    margin:'auto',
    marginBottom: theme.spacing(2),
    '& > div':{
      padding: theme.spacing(2),
    }
  },
  editItemTitle: {
    fontWeight: 700,
    textAlign: "center",
    textTransform: "Capitalize",
    fontSize:"1rem",
    padding: theme.spacing(1)
  },
  media: {
    height: 80,
  }

}));


const indexToTabName = {
  0: "contact",
  1: "education",
  2: "experience",
  3: "skills",
  4: "projects",
  5: "custom1",
  6: "custom2"
};

const tabNames = Object.values(indexToTabName);

function EditMobile(props) {
  const classes = useStyles();
  const { history, location } = props;
  
  const navigateToPage = (e, item) => {
    history.push(`${location.pathname}/${item}`)
  }

  return (
    <>
      <div>
        <Typography className={classes.title} color="primary" variant="h4" gutterBottom>
          Edit Your Profile
        </Typography>
        <Typography className={classes.subtitle} variant="caption" gutterBottom>
          Let other people know you more! Add projects, portfolio and details to get others to know you more
        </Typography>
        
      
        <Paper className={classes.root} elevation={1}>
          <Grid container justify="center">
            {
              tabNames.map((item,key) => {
                return(
                  <Grid item xs={6} key={key}>
                    <Card variant="outlined" className={classes.editItem}>
                      <CardActionArea onClick={(e) => navigateToPage(e,item)}>
                        <CardMedia
                          className={classes.media}
                          image={`https://images.pexels.com/photos/2911521/pexels-photo-2911521.jpeg?auto=compress&cs=tinysrgb&h=300&w=300`}
                          title="Contemplative Reptile"
                        />
                        <Typography className={classes.editItemTitle} gutterBottom>
                          {item}
                        </Typography>
                      </CardActionArea>
                    </Card>
                  </Grid>
                )
              })
            }
          </Grid>
        </Paper>
        <Route exact path="/app/home/edit/:username/:page" component={SlideLayout}/>
      </div>
   
      
    </>
  )
}

export default withRouter(EditMobile);
