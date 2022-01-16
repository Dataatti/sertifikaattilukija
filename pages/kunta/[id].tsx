import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { Grid, Typography } from '@mui/material';
import CompanyListItem from 'components/CompanyListItem';

const CityResult = ({ companies, city }: { companies: Company[]; city: City }) => {
  return (
    <main>
      <Head>
        <title>{city.name}</title>
        <meta name="description" content={`${city.name} - matkailusertifikaatit`} />
      </Head>
      <Grid container direction="column" sx={{ height: '100vh' }}>
        <Grid item>
          <Typography component="h1" variant="h3">
            {city.name}
          </Typography>
        </Grid>
        <Grid item>
          <Typography component="h2" variant="h3">
            Sertifikaatin omaavat yritykset
          </Typography>
          <Grid container>
            {companies.map((company) => {
              return (
                <Grid item key={company.slug}>
                  <CompanyListItem company={company} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Get data from database with params.id as company certificate slug / city name

  return {
    props: {
      companies: [
        {
          name: 'Turun matkailuyritys Oy',
          city: 'Turku',
          slug: 'turun-matkailuyritys-oy',
          certificates: [
            {
              name: 'Green Key',
              logoUrl: 'https://picsum.photos/500',
              slug: 'green-key',
            },
            {
              name: 'Joutsenmerkki',
              logoUrl: 'https://picsum.photos/500',
              slug: 'joutsenmerkki',
            },
          ],
        },
      ],
      city: {
        name: 'Turku',
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Get data from database
  const cities = ['turku'];

  const paths = cities.map((city) => {
    return { params: { id: city } };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export default CityResult;
