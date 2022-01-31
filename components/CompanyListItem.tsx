import Link from 'next/link';
import { Grid, Link as MuiLink, Typography } from '@mui/material';
import certificates from 'enums/certificates.json';

const capitalizeFirstLetter = (string: string) => {
  if (!string) return null;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const CompanyListItem = ({ company }: { company: Company }) => {
  return (
    <Grid item>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Link href={`/${company.vatNumber}`} passHref>
            <MuiLink color="text.primary" sx={{ fontWeight: '600' }}>
              {company.name}
            </MuiLink>
          </Link>
          <Typography>{capitalizeFirstLetter(company.city)}</Typography>
        </Grid>
        <Grid item>
          {company.certificateId?.map((id) => {
            const certificate = certificates.find((certificate) => certificate.id === id);
            if (certificate) {
              return (
                <Link href={`/sert/${certificate.id}`} passHref key={certificate.id}>
                  <MuiLink>
                    <img src={certificate.logoUrl} alt={certificate.name} height="50px" />
                  </MuiLink>
                </Link>
              );
            }
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CompanyListItem;
