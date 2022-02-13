import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1D764A',
      contrastText: '#DBEEFE',
    },
    common: {
      black: '#2222222',
    },
  },
  typography: {
    fontWeightRegular: 500,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#DBEEFE',
          color: '#1D764A',
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
