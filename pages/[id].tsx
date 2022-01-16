import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Grid, Typography, Link as MuiLink } from '@mui/material';

const CompanyResult = ({ company }: { company: Company }) => {
  return (
    <main>
      <Head>
        <title>{company.name}</title>
        <meta name="description" content={`${company.name} - matkailusertifikaatit`} />
      </Head>
      <Grid container direction="column" sx={{ height: '100vh' }}>
        <Grid item>
          <Typography component="h1" variant="h3">
            {company.name}
          </Typography>
          <Typography>{company.address}</Typography>
          <Link href={`/kunta/${company.city}`} passHref>
            <MuiLink>{company.city}</MuiLink>
          </Link>
          <Typography>{company.businessId}</Typography>
        </Grid>
        <Grid item>
          <Typography component="h2" variant="h3">
            Yrityksen sertifikaatit
          </Typography>
          <Grid container>
            {company.certificates.map((certificate) => {
              return (
                <Grid item key={certificate.slug}>
                  <img src={certificate.logoUrl} alt={certificate.name} height="100px" />
                  <Link href={`/sert/${certificate.slug}`} passHref>
                    <MuiLink>{certificate.name}</MuiLink>
                  </Link>
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
  // Get data from database with params.id as company slug / business id

  return {
    props: {
      company: {
        name: 'Turun matkailuyritys Oy',
        businessId: '123456-7',
        city: 'Turku',
        address: 'Yliopistonkatu 48A, 20100 Turku',
        certificates: [
          {
            name: 'Green Key',
            logoUrl: 'https://picsum.photos/500',
            slug: 'green-key',
          },
        ],
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Get data from database
  const companySlugs = ['turun-matkailuyritys-oy'];
  const businessIds = ['123456-7'];

  const paths = companySlugs.concat(businessIds);
  const pathsInParamsFormat = paths.map((path) => {
    return { params: { id: path } };
  });

  return {
    paths: pathsInParamsFormat,
    fallback: false,
  };
};

export default CompanyResult;
