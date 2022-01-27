import type { Knex } from 'knex';
import { upsertCompanyCertificates } from 'utils/database';

/**
 * SFT api types
 */
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

/**
 * Function for fetching all sft sertificates
 * SFT api doesn't have metadata or anything to know
 * how many certificates are there so we have to fetch until
 * api returns 404
 * @returns
 */
const fetchAllSFT = async () => {
  let i = 1;
  let hasMore = true;
  let SFTCertificates: SFTCertificate[] = [];

  while (hasMore) {
    const data: SFTCertificate[] = await fetchSFT(i);
    if (data) {
      SFTCertificates = [...SFTCertificates, ...data];
    } else {
      hasMore = false;
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
export const syncSFTCertificates = async (db: Knex<any, unknown[]>) => {
  const SFTCertificates = await fetchAllSFT();
  if (SFTCertificates.length <= 0) {
    throw new Error('No SFT certificates found');
  }

  const companyCertificates: CompanyCertificate[] = SFTCertificates.map((cert) => ({
    companyName: cert.name,
    certificateId: 'sft',
  }));

  await upsertCompanyCertificates(companyCertificates, db);

  return true;
};
