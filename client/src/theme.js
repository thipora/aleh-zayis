import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#fdf9f3',
    },
    primary: {
      main: '#8d6e63',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5d4037',
    },
    error: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: "'Assistant', 'Rubik', 'sans-serif'",
    h4: {
      fontWeight: 600,
      color: '#5d4037',
    },
    body2: {
      color: '#5d4037',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fefaf5',
        },
      },
    },
  },
});

export default theme;
