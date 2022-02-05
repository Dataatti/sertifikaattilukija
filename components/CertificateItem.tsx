import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';

const CertificateItem = ({ certificate }: { certificate: Certificate }) => {
  const { id, logoUrl, name } = certificate;

  return (
    <Link href={`/sert/${id}`} passHref>
      <MuiLink>
        <img
          src={logoUrl}
          alt={name}
          height="100px"
          width="200px"
          style={{ objectFit: 'contain' }}
        />
      </MuiLink>
    </Link>
  );
};

export default CertificateItem;
