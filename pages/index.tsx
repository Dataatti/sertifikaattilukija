import type { GetStaticProps } from 'next';
import { ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/router';
import { Grid, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import SearchInput from 'components/SearchInput';

interface HomeProps {
  companyNames: SearchOption[];
  companyIds: SearchOption[];
  cities: SearchOption[];
  certificates: SearchOption[];
}

const Home = ({ companyNames, companyIds, cities, certificates }: HomeProps) => {
  const router = useRouter();
  const selectedSlug = useRef(null);

  const searchOptions = companyNames.concat(companyIds, cities, certificates);

  const onSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const slug = selectedSlug.current;
    slug && router.push(slug);
  };

  return (
    <main>
      <Grid container direction="column" sx={{ height: '100vh' }}>
        <Grid item xs={9} sm={10} md={11}>
          <Grid container direction="column" sx={{ height: '100%' }}>
            <Grid container item xs={7} justifyContent="center" alignItems="center">
              <Typography component="h1" variant="h2" sx={{ width: 'min-content' }}>
                Matkailualan sertifikaattilukija
              </Typography>
              <Search style={{ fontSize: '8rem' }} />
            </Grid>

            <Grid item xs={5} sx={{ px: '10px' }}>
              <form onSubmit={onSubmit}>
                <SearchInput searchOptions={searchOptions} slugRef={selectedSlug} />
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

export const getStaticProps: GetStaticProps = async () => {
  // Get data from database

  return {
    props: {
      companyNames: [ { label: 'Turun matkailuyritys Oy', slug: 'turun-matkailuyritys-oy' } ],
      companyIds: [ { label: '123456-7', slug: '123456-7' } ],
      cities: [ { label:'Turku', slug: 'kunta/turku' } ],
      certificates: [ { label:'Green Key', slug: 'sert/green-key' } ],
    },
  };
};

export default Home;
