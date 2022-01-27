import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { Grid, Typography, Link as MuiLink } from '@mui/material';
import certificates from 'enums/certificates.json';

const CertificateResult = ({ certificate }: { certificate: Certificate }) => {
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
          <img src={certificate.logoUrl} alt={certificate.name} height="100px" />
          <Typography>{certificate.description}</Typography>
          <Typography>
            Lisätietoa:
            <MuiLink href={certificate.website}>{certificate.website}</MuiLink>
          </Typography>
        </Grid>
        <Grid item>
          <Typography component="h2" variant="h3">
            Sertifikaatin omaavat yritykset
          </Typography>
        </Grid>
      </Grid>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const certificate = certificates.find((certificate) => certificate.id === params?.id);

  return {
    props: {
      certificate: certificate,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const certificateIds = certificates.map((certificate) => certificate.id);

  const paths = certificateIds.map((certificateId) => {
    return { params: { id: certificateId } };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export default CertificateResult;
