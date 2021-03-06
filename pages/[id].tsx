import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { Button, Grid, Typography, Link as MuiLink } from '@mui/material';
import { Print } from '@mui/icons-material';
import certificates from 'enums/certificates.json';
import CertificateItem from 'components/CertificateItem';

const CompanyResult = ({ company }: { company: Company }) => {
  let stf;
  let certs;

  if (company?.certificateId) {
    certs = company.certificateId;
    const hasStf = company.certificateId.some((certId) => certId === 'stf');
    if (hasStf) {
      stf = certificates.find((cert) => cert.id === 'stf');
      certs = certs.filter((certId) => certId !== 'stf');
    }
    certs = certs.map((certId) => certificates.find((cert) => cert.id === certId));
  }

  const getAddressInfo = (company: Company) => {
    const { address, postCode, city } = company;
    const addressArray = [address, postCode, city].filter(n => n);
    return addressArray.length ? addressArray.join(', ') : 'Ei osoitetietoja';
  };

  return (
    <main>
      <Head>
        <title>{company.name}</title>
        <meta name="description" content={`${company.name} - matkailusertifikaatit`} />
      </Head>
      <Button
        variant="contained"
        onClick={() => window.print()}
        sx={{ float: 'right', mt: '15px' }}
        data-testid="print-button"
      >
        <Print /> Tulosta
      </Button>
      <Grid container sx={{ mt: '15px' }}>
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h5" data-testid="company-name" sx={{ mb: '20px' }}>
            {company.name}
          </Typography>
          <Typography data-testid="company-address">{getAddressInfo(company)}</Typography>
          <Typography data-testid="company-vat">{`Y-tunnus: ${company.vatNumber}`}</Typography>
          {stf && <CertificateItem certificate={stf} />}
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: { xs: '20px', md: 0 } }}>
          <Typography component="h2" variant="h5" sx={{ mb: '20px' }}>
            Yrityksen sertifikaatit
          </Typography>
          <Grid container data-testid="company-certificates">
            {certs ? (
              certs.map((cert) => {
                if (cert) {
                  return (
                    <Grid item key={cert.id}>
                      <CertificateItem certificate={cert} />
                    </Grid>
                  );
                }
              })
            ) : (
              <Grid item>
                <Typography>Yrityksell?? ei viel?? ole sertifikaatteja</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Typography align="center" sx={{ mt: '20vh' }}>
        Ovatko yrityksen tiedot virheelliset? Ota yhteytt?? osoitteeseen{' '}
        <MuiLink href="mailto:stf@businessfinland.fi">
          stf (at) businessfinland.fi
        </MuiLink>
      </Typography>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const vatNumber = params?.id as string;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data?name=${vatNumber}`);
    const { data: companies } = await res.json();

    if (!companies[0]) throw new Error();
    return {
      props: {
        company: companies[0],
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default CompanyResult;
