import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Grid, Typography, Link as MuiLink } from '@mui/material';
import { dbClient } from 'utils/database';

const CompanyResult = ({ company, certificates }: { company: Company, certificates: string[] }) => {
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
            {certificates.map((certificate) => {
              return (
                <Grid item key={certificate}>
                  {/* <img src={certificate.logoUrl} alt={certificate.name} height="100px" /> */}
                  <Link href={`/sert/${certificate}`} passHref>
                    <MuiLink>{certificate}</MuiLink>
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
  const vat_number = params?.id;
  const company = await dbClient('company')
    .column(
      'id',
      'name',
      'vat_number',
      'address',
      'city',
      'post_code'
    )
    .where('vat_number', vat_number)
    .first();

  const certificates = await dbClient('company_certificate').column('certificate_id').where('company_id', company.id);

  const certificateArray = certificates.map((certificate) => certificate.certificate_id);

  return {
    props: {
      company: company,
      certificates: certificateArray
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const companyVats = await dbClient('company').whereNull('blacklisted').column('vat_number');

  const paths = companyVats.map(({vat_number}) => {
    return { params: { id: vat_number } };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export default CompanyResult;
