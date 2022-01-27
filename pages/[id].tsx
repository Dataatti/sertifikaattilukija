import type { GetStaticProps, GetStaticPaths, NextApiRequest, NextApiResponse } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Grid, Typography, Link as MuiLink } from '@mui/material';
import { databaseHoc, getCompanies, NextRequestWithDb } from 'utils/database';
import { sleep } from 'utils/utils';

import certificates from 'enums/certificates.json';

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
          <Typography>{company.city}</Typography>
          <Typography>{company.vatNumber}</Typography>
        </Grid>
        <Grid item>
          <Typography component="h2" variant="h3">
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
