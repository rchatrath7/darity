import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../../util/withRoot';
import Grid from 'material-ui/Grid'; 
import Summary from '../../components/Trades/Summary/Summary'; 
import Charity from '../../components/Trades/Charity/Charity';
import Splash from '../../components/Trades/Splash/Splash'; 
import Stats from '../../components/Trades/Stats/Stats'; 

const styles = theme => ({
  centered: {
    justifyContent: 'center',
    alignItems: 'center', 
  },

});

class Index extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div>
        <Splash /> 
        <Grid className={classes.centered} container spacing={12}> 
          <Grid item xs={4}> 
            <Stats /> 
          </Grid>
          <Grid item xs={4}>
            <Charity /> 
          </Grid>
        </Grid>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));
