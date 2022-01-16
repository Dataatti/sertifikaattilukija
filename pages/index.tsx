import type { NextPage } from 'next';
import { Grid, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import SearchInput from 'components/SearchInput';

interface HomeProps {
  companyNames: string[];
  companyIds: string[];
  cities: string[];
  certificates: string[];
}

const Home: NextPage<HomeProps> = ({ companyNames, companyIds, cities, certificates }) => {
  const searchOptions = companyNames.concat(companyIds, cities, certificates);

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(event.target[0].value);
  }

  return (
    <main>
      <Grid container direction="column" sx={{ height: '100vh' }}>
        <Grid item xs={9} sm={10} md={11}>
          <Grid container direction="column" sx={{ height: '100%' }} >
            <Grid container item xs={7} justifyContent="center" alignItems="center">
              <Typography component="h1" variant="h2" sx={{ width: 'min-content' }}>
                Matkailualan sertifikaattilukija
              </Typography>
              <Search style={{ fontSize: '8rem' }} />
            </Grid>

            <Grid item xs={5} sx={{ px: '10px' }}>
              <form onSubmit={onSubmit}>
                <SearchInput searchOptions={searchOptions} />
              </form>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <Typography align="center">
            Business Finlandin mukaan sertifiointi on laadun tae kansainvälisessä kaupassa.
            Matkailualan monimuotoisuus on kuitenkin mahdollistanut sen, että myös sertifikaatin
            tarjoajia on hyvin paljon. Ideana on tuottaa nyt hankalasti ja pirstoutuneena oleva
            tieto yhteen paikkaan kaikkien toimijoiden avoimesti saataville.
          </Typography>
        </Grid>
      </Grid>
    </main>
   );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      companyNames: ['Turun matkailuyritys Oy'],
      companyIds: ['123456-7'],
      cities: ['Turku'],
      certificates: ['Green Key']
    }
  }
};

export default Home;
