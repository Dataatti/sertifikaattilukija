interface Company {
  companyId?: number;
  name: string;
  vatNumber: string;
  city: string;
  address: string;
  postCode: string;
  certificateId?: string[];
}

interface Certificate {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  description: string;
}
