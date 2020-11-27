import {Container, createMuiTheme, CssBaseline, ThemeProvider} from '@material-ui/core';
import React from 'react';
import './App.css';

interface AppProps {

}

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

const App: React.FC<AppProps> = () => {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <h1>Hello</h1>
        </Container>
      </ThemeProvider>
    );
}

export default App;
