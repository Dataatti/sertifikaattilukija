import Link from 'next/link';
import { Grid, Link as MuiLink, Typography } from '@mui/material';
import certificates from 'enums/certificates.json';

const CompanyListItem = ({ company }: { company: Company }) => {
  return (
    <Grid item>
      <Link href={`/${company.vatNumber}`} passHref>
        <MuiLink>{company.name}</MuiLink>
      </Link>
      <Typography>{company.city}</Typography>
      <div>
        {company.certificateId?.map((id) => {
          const certificate = certificates.find((certificate) => certificate.id === id);
          if (certificate) {
            return (
              <Link href={`/sert/${certificate.id}`} passHref key={certificate.id}>
                <MuiLink>
                  <img src={certificate.logoUrl} alt={certificate.name} height="100px" />
                </MuiLink>
              </Link>
            );
          }
        })}
      </div>
    </Grid>
  );
};

export default CompanyListItem;
