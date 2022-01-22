import { upsertCompanyCertificates } from 'utils/database';
import { getErrorMessage, sleep } from 'utils/utils';

type SFTCertificate = {
  id: string;
  name: string;
  address: string;
  zipcode: string;
  url: string;
  public_name: string;
  city: string;
  region: string;
  greater_area: string;
  description: string;
  featured_image: string;
  category: string;
  service_categories: any[];
};

const fetchSFT = async (page: number) => {
  try {
    const res = await fetch(
      `https://api.sustainabletravel.businessfinland.fi/public/accepted-companies/${page}`
    );
    const json = await res.json();
    return json?.data;
  } catch (err) {
    return null;
  }
};

const fetchAllSFT = async () => {
  let i = 1;
  // replace
  let SFTCertificates: SFTCertificate[] = [];
  while (i < 100) {
    const data: SFTCertificate[] = await fetchSFT(i);
    if (data) {
      SFTCertificates = [...SFTCertificates, ...data];
    } else {
      break;
    }
    i++;
  }

  return SFTCertificates;
};

/**
 * Function for fetching and syncing SFT certificates
 * from https://api.sustainabletravel.businessfinland.fi/public/accepted-companies/
 * @returns status as boolean, true = ok
 */
export const syncSFTCertificates = async () => {
  const SFTCertificates = await fetchAllSFT();
  if (SFTCertificates.length <= 0) {
    throw new Error('No SFT certificates found');
  }

  const companyCertificates: CompanyCertificate[] = SFTCertificates.map((cert) => ({
    companyName: cert.name,
    certificateId: 'sft',
  }));

  await upsertCompanyCertificates(companyCertificates);

  return true;
};
