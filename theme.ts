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
          backgroundColor: '#1D764A',
          color: '#FFFFFF',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#1D764ACC',
          },
          '& .MuiSvgIcon-root': {
            marginRight: '4px',
          }
        },
      },
    },
  },
});

export default theme;
