type Company = {
  id?: number;
  name: string;
  vat_number: string;
  address?: string;
  post_code?: string;
  city?: string;
};

type CompanyCertificate = {
  companyName: string;
  certificateId: string;
};