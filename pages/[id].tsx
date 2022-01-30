import type { GetStaticProps, GetStaticPaths, NextApiResponse } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Grid, Typography, Link as MuiLink } from '@mui/material';
import { databaseHoc, getCompanies, NextRequestWithDb } from 'utils/database';
import { Print } from '@mui/icons-material';
import certificates from 'enums/certificates.json';

const CompanyResult = ({ company }: { company: Company }) => {
  return (
    <main>
      <Head>
        <title>{company.name}</title>
        <meta name="description" content={`${company.name} - matkailusertifikaatit`} />
      </Head>
      <Button variant="contained" onClick={() => window.print()} sx={{ float: 'right', mt: '15px' }}>
        <Print /> Tulosta
      </Button>
      <Grid container sx={{ mt: '15px' }}>
        <Grid item xs={12} md={6}>
          <Typography component="h2" variant="h5">
            {company.name}
          </Typography>
          <Typography sx={{ mt: '20px' }}>{`${company.address}, ${company.postCode} ${company.city}`}</Typography>
          <Typography>{`Y-tunnus: ${company.vatNumber}`}</Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: { xs: '20px', md: 0 } }}>
          <Typography component="h2" variant="h5">
            Yrityksen sertifikaatit
          </Typography>
          <Grid container>
            {company.certificateId?.map((id) => {
              const certificate = certificates.find((certificate) => certificate.id === id);
              if (certificate) {
                return (
                  <Grid item key={certificate.id}>
                    <Link href={`/sert/${certificate.id}`} passHref>
                      <MuiLink>
                        <img src={certificate.logoUrl} alt={certificate.name} height="100px" />
                      </MuiLink>
                    </Link>
                  </Grid>
                );
              }
            })}
          </Grid>
        </Grid>
      </Grid>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const vatNumber = params?.id as string;

  const hoc = databaseHoc()(async (req) => {
    const { companies } = await getCompanies(req.db, 1, 0, vatNumber);
    return companies;
  });
  const companies = await hoc({} as NextRequestWithDb, {} as NextApiResponse);

  return {
    props: {
      company: companies[0],
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default CompanyResult;
