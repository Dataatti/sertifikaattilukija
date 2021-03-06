import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { Box, Button, Grid, Typography, Link as MuiLink } from '@mui/material';
import certificates from 'enums/certificates.json';
import { Print } from '@mui/icons-material';

const CertificateResult = ({ certificate }: { certificate: Certificate }) => {
  return (
    <main>
      <Head>
        <title>{certificate.name}</title>
        <meta name="description" content={`${certificate.name} - matkailusertifikaatit`} />
      </Head>
      <Button
        variant="contained"
        onClick={() => window.print()}
        sx={{ float: 'right', my: '15px' }}
        data-testid="print-button"
      >
        <Print /> Tulosta
      </Button>
      <Grid container sx={{ mt: '15px' }}>
        <Grid item xs={12} md={4}>
          <Typography component="h2" variant="h5" data-testid="cert-name">
            {certificate.name}
          </Typography>
          <Box sx={{ my: '15px' }}>
            <img
              src={certificate.logoUrl}
              alt={certificate.name}
              width="300px"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography component="h3" variant="h5">
            Tietoja sertifikaatista
          </Typography>
          <Typography data-testid="cert-desc" sx={{ my: '10px' }}>
            {certificate.description}
          </Typography>
          <Typography>
            <MuiLink data-testid="cert-website" href={certificate.website}>
              {certificate.website}
            </MuiLink>
          </Typography>
          <Typography component="h3" variant="h5" sx={{ mt: '30px' }}>
            Sertifikaatin omaavat yritykset
          </Typography>
          <Button
            href={`/?cert=${certificate.id}`}
            variant="contained"
            data-testid="cert-companies"
            sx={{ my: '25px' }}
          >
            Näytä yritykset
          </Button>
        </Grid>
      </Grid>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const certificate = certificates.find((certificate) => certificate.id === params?.id);

  return {
    props: {
      certificate,
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
