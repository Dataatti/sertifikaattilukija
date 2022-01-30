import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main:'#F97C80',
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export default theme;
