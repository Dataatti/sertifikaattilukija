import { Container, Divider, Grid, Link, Paper, Typography } from '@mui/material';

const Header = () => {
  return (
    <Paper sx={{ bgcolor: 'grey.800', color: 'common.white', fontWeight: '500' }}>
      <Container>
        <Typography align="center" sx={{ p: '20px' }}>
          Business Finlandin mukaan sertifiointi on laadun tae kansainvälisessä kaupassa.
          Matkailualan monimuotoisuus on kuitenkin mahdollistanut sen, että myös sertifikaatin
          tarjoajia on hyvin paljon. Ideana on tuottaa nyt hankalasti ja pirstoutuneena oleva tieto
          yhteen paikkaan kaikkien toimijoiden avoimesti saataville.
        </Typography>
        <Divider sx={{ bgcolor: 'common.white' }} />
        <Grid container justifyContent="space-around" sx={{ p: '10px' }}>
          <Grid item>
            <Link href="https://european-union.europa.eu/index_fi" color="inherit">
              <img src="/images/EU.png" alt="EU" height="80px" />
            </Link>
          </Grid>
          <Grid item>
            <Link href="https://stm.fi/rahoitus-ja-avustukset/eun-rakennerahastot" color="inherit">
              <img
                src="/images/vipuvoimaa-eulta.png"
                alt="Vipuvoimaa EU:lta 2014-2020"
                height="80px"
              />
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default Header;
