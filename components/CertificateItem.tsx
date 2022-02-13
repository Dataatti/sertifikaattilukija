import Link from 'next/link';
import { Link as MuiLink } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const CertificateItem = ({ certificate }: { certificate: Certificate }) => {
  const { id, logoUrl, name } = certificate;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));


  return (
    <Link href={`/sert/${id}`} passHref>
      <MuiLink className="company-item-cert">
        <img
          src={logoUrl}
          alt={name}
          height={mobile ? '50px' : '100px'}
          width={mobile ? '100px' : '200px'}
          style={{ objectFit: 'contain' }}
        />
      </MuiLink>
    </Link>
  );
};

export default CertificateItem;
