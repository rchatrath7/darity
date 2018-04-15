import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue'; 
import light-blue from 'martial-ui/colors/light-blue'; 
import green from 'material-ui/colors/green';
import pink from 'material-ui/colors/pink'; 
import CssBaseline from 'material-ui/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: blue[300],
      main:  blue[500],
      dark:  blue[700],
    },
    secondary: {
      light: light-blue[100],
      main:  light-blue[300],
      dark:  light-blue[500],
    },
    tertiary: {
      light: green['A100'],
      main:  green['A400'], 
      dark:  green['A700'], 
    },
    accent: {
      light: pink[300], 
      main:  pink[500], 
      dark:  pink[700], 
    },
  },
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
