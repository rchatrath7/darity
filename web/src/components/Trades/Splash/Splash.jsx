import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../../../util/withRoot';
import Grid from 'material-ui/Grid'; 
import Avatar from 'material-ui/Avatar';

const styles = theme => ({

  container: {
    justifyContent: 'center',
    height: '75vh', 
  },

  avatar: {
    backgroundColor: theme.palette.primary.main,
    width: 150, 
    height: 150, 
    fontSize: '3em', 
  },

  cell: {
    padding: 30,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center', 
  },

  imageContainer: {
    padding: 30,
    display: 'flex', 
    alignItems: 'center', 
  },

  tol: {
    fontSize: '2.5em', 
  }, 

  lessTol: {
    fontSize: '2em', 
  },
});

class Splash extends React.Component {
  render() {
    const { classes } = this.props; 

    return (
      <div>
        <Grid className={classes.container} container spacing={12}>
          <Grid className={classes.imageContainer} item xs={2}>
            <Avatar className={classes.avatar}>D</Avatar>
          </Grid>        
          <Grid className={classes.cell} item xs={4}>
            <Typography component="h1" className={classes.tol}>Title for the Dare</Typography>
            <Typography component="h2" className={classes.lessTol}>Name of the charitiy</Typography>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Splash.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Splash));

