interface Company {
  name: string;
  businessId: string;
  city: string;
  address: string;
  slug: string;
  certificates: Certificate[];
}

interface Certificate {
  name: string;
  logoUrl: string;
  slug: string;
  website: string;
}

interface City {
  name: string;
}
