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
                '& .MuiSvgIcon-root': {
                    marginRight: '5px',
                }
            },
        },
    },
});

export default theme;
