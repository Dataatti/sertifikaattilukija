type ApiCompany = {
  id?: number;
  name: string;
  vat_number: string;
  address?: string;
  post_code?: string;
  city?: string;
};

type ApiCompanyCertificate = {
  companyName: string;
  certificateId: string;
};
