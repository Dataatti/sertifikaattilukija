import Link from 'next/link';
import { Grid, Link as MuiLink, Typography } from '@mui/material';
import certificates from 'enums/certificates.json';
import CertificateItem from 'components/CertificateItem';

const capitalizeFirstLetter = (string: string) => {
  if (!string) return null;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const CompanyListItem = ({ company }: { company: Company }) => {
  return (
      <Grid container item xs={12} className="company-item" justifyContent="space-between" alignItems="center" wrap='nowrap'>
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
              return <CertificateItem certificate={certificate} key={certificate.id} />;
            }
          })}
        </Grid>
      </Grid>
  );
};

export default CompanyListItem;
