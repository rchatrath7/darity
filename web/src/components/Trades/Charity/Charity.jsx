import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../../../util/withRoot';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Chip from 'material-ui/Chip'; 

const styles = theme => ({ 
  card: {
    maxWidth: 400,
    borderRadius: 8,
    marginTop: 10, 
    marginBottom: 10, 
    marginLeft: 'auto', 
    marginRight: 'auto',
  },

  coloredChip: {
    backgroundColor: theme.palette.primary.main, 
  },
});

class Charity extends React.Component {
  render() {
    const { classes } = this.props; 

    return (
      <div>
        <Card className={classes.card}>
          <CardHeader 
            title="Charity Title"
          />
          <CardContent>
            <Typography component="p">Description about a charity</Typography>
          </CardContent>
          <CardActions>
            <Chip key='0' label="Category" className={classes.coloredChip}></Chip>
          </CardActions>
        </Card>
      </div>
    );
  }
}

Charity.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Charity));
