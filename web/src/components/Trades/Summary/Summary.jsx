import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../../../util/withRoot';

const styles = theme => ({
  root: {
    textAlign: 'center', 
  },  
});

class Summary extends React.Component {
  render () {
    const { classes } = this.props; 

    return (
      <div className={classes.root}></div>
    )    
  }
}

Summary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Summary));
