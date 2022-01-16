import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { Grid, Typography, Link as MuiLink } from '@mui/material';
import CompanyListItem from 'components/CompanyListItem';

const CertificateResult = ({
  companies,
  certificate,
}: {
  companies: Company[];
  certificate: Certificate;
}) => {
  return (
    <main>
      <Head>
        <title>{certificate.name}</title>
        <meta name="description" content={`${certificate.name} - matkailusertifikaatit`} />
      </Head>
      <Grid container direction="column" sx={{ height: '100vh' }}>
        <Grid item>
          <Typography component="h1" variant="h3">
            {certificate.name}
          </Typography>
          <Typography>
            Lisätietoa:
            <MuiLink href={certificate.website}>{certificate.website}</MuiLink>
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
      certificate: {
        name: 'Green Key',
        logoUrl: 'https://picsum.photos/500',
        website: 'https://greenkey.fi',
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Get data from database
  const certificateSlugs = ['green-key'];
  const cities = ['Turku'];

  const paths = certificateSlugs.concat(cities);
  const pathsInParamsFormat = paths.map((path) => {
    return { params: { id: path } };
  });

  return {
    paths: pathsInParamsFormat,
    fallback: false,
  };
};

export default CertificateResult;
