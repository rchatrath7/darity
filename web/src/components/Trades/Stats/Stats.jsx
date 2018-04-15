import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../../../util/withRoot';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'; 
import AllInclusiveIcon from '@material-ui/icons/AllInclusive'; 
import Background from '../../../images/Trades/Splash/filthywhore.svg'; 

const styles = theme => ({
  icon: {
    color: theme.palette.secondary.main, 
  },

  graphic: {
    bacgroundImage: "url(" + Background + ")", 
    transform: "rotate(-90deg)", 
  },

});

class Stats extends React.Component {
  render() {
    const { classes } = this.props; 

    return (
      <div>
        <IconButton><AllInclusiveIcon className={classes.icon} /><Typography component="h1">12</Typography></IconButton>
        <div className={classes.graphic}></div>
        <IconButton><AttachMoneyIcon className={classes.icon} /><Typography component="h1">20.0</Typography></IconButton>
      </div>
    )
  }
}

Stats.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Stats));

