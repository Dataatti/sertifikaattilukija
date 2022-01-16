import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';

const CompanyListItem = ({ company, hideCity }: { company: Company, hideCity?: boolean }) => {
  return (
    <>
      <Link href={`/${company.slug}`} passHref>
        <MuiLink>
          {company.name}
        </MuiLink>
      </Link>
      {!hideCity &&
        <Link href={`/kunta/${company.city}`} passHref>
          <MuiLink>{company.city}</MuiLink>
        </Link>
      }
      <div>
        {company.certificates.map((certificate) => {
          return (
            <Link href={`/sert/${certificate.slug}`} passHref key={certificate.slug}>
              <MuiLink>
                <img src={certificate.logoUrl} alt={certificate.name} height="100px" />
              </MuiLink>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default CompanyListItem;
