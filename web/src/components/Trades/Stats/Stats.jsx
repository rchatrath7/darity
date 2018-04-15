import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../../../util/withRoot';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'; 
import AllInclusiveIcon from '@material-ui/icons/AllInclusive'; 
import IconButton from 'material-ui/IconButton'; 
import Background from '../../../images/Trades/Splash/filthywhore.svg';
import { LinearProgress } from 'material-ui/Progress'; 

const styles = theme => ({
  padded: {
    padding: 20, 
  },

  tolButton: {
    width: 175, 
    height: 175, 
    margin: '0 30',
    padding: '0 20', 
  },

  icon: {
    color: theme.palette.secondary.main,
    width: 35, 
    height: 35, 
  },

  graphic: {
    display: 'inline-block', 
    width: 115, 
    height: 12, 
    backgroundImage: "url(" + Background + ")",
    backgroundRepeat: 'no-repeat', 
  },

  tol: {
    margin: '0 15', 
    fontSize: '3.5rem',
  },

});

class Stats extends React.Component {
  state = {
    completed: 50, 
  }
  
  render() {
    const { classes } = this.props; 

    return (
      <div className={classes.padded}>
        <IconButton className={classes.tolButton}><AllInclusiveIcon className={classes.icon} /><Typography className={classes.tol} component="h1">12</Typography></IconButton>
        <div className={classes.graphic}></div>
        <IconButton className={classes.tolButton}><AttachMoneyIcon className={classes.icon} /><Typography className={classes.tol} component="h1">20</Typography></IconButton>
        <LinearProgress variant="indeterminant" value={this.state.completed}></LinearProgress>
      </div>
    )
  }
}

Stats.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Stats));

