import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../../../util/withRoot';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton'; 
import FavoriteIcon from '@material-ui/icons/Favorite'; 
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'; 

const styles = theme => ({
  card: {
    maxWidth: 400,
    borderRadius: 8,
    marginTop: 10, 
    marginBottom: 10, 
    marginLeft: 'auto', 
    marginRight: 'auto',
  },

  avatar: {
   backgroundColor: theme.palette.primary.main,  
  },

  icon: {
    color: theme.palette.tertiary.main, 
  },

  cardContentTitle: {
    fontSize: 18, 
  },

  action: {
    borderTopStyle: 'solid', 
    borderTopWidth: 1, 
    borderTopColor: theme.palette.secondary.light, 
  },
});

class Summary extends React.Component {
  render () {
    const { classes } = this.props; 

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Daredevil" className={classes.avatar}>
              D
            </Avatar>
          }
          title="Filler Dare title"
          subheader="Filler charity name"
        />
        <CardContent>
          <Typography component="h2" className={classes.cardContentTitle}>
            Summary
          </Typography>
          <Typography component="p">
            Filler text about this dare. 
          </Typography>
        </CardContent>
        <CardActions className={classes.action}>
          <IconButton aria-label="Dares">
            <FavoriteIcon className={classes.icon} />
            <Typography component="p">12</Typography>
          </IconButton> 
          <IconButton aria-label="Total Raised" disabledIconSpacing>
            <AttachMoneyIcon className={classes.icon} /> 
            <Typography component="p">20.00</Typography>
          </IconButton>
          <IconButton aria-label="Donate"></IconButton>
        </CardActions>
      </Card>
    )    
  }
}

Summary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Summary));
