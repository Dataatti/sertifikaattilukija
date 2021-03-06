import Link from 'next/link';
import { AppBar, Container, Grid, Link as MuiLink, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();
  return (
    <AppBar position="static" color="inherit" sx={{ bgcolor: '#222222' }}>
      <Container>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Link href="/" passHref>
              <MuiLink underline="none">
                <Typography
                  component="h1"
                  sx={{ fontWeight: '500', fontSize: '22px', p: '7px', color: 'common.white' }}
                >
                  Matkailualan
                  <br /> sertifikaatit
                </Typography>
              </MuiLink>
            </Link>
          </Grid>
          {router.pathname !== '/' && (
            <Grid item>
              <Link href="/" passHref>
                <MuiLink
                  data-testid="link-to-search"
                  sx={{ color: '#BCE3BF', textDecorationColor: '#BCE3BF' }}
                >
                  Yrityshakuun
                </MuiLink>
              </Link>
            </Grid>
          )}
        </Grid>
      </Container>
    </AppBar>
  );
};

export default Header;
