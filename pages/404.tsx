import Head from 'next/head';
import Link from 'next/link';
import { Button, Grid, Typography, Link as MuiLink } from '@mui/material';

const Custom404 = () => {
  return (
    <main>
      <Grid container direction="column" alignItems="center" justifyContent="center" spacing={4} sx={{minHeight: 'calc(100vh - 80px - 220px)'}} >
          <Grid item>
          <Typography variant="h5">
            404
          </Typography>
          </Grid>
          <Grid item>
          <Typography component="h1" variant="h5">
              Sivua ei löytynyt
          </Typography>
          </Grid>
          <Grid item>
          <Link href="/" passHref>
              <Button variant="contained">Takaisin etusivulle</Button>
          </Link>
          </Grid>
      </Grid>
    </main>
  );
};

export default Custom404;
