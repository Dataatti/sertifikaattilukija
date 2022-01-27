import type { GetStaticProps } from 'next';
import { ChangeEvent, useState, useRef } from 'react';
import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { dbClient } from 'utils/database';
import cities from 'enums/cities.json';
import certificates from 'enums/certificates.json';
import CompanyListItem from 'components/CompanyListItem';

interface HomeProps {
  firstCompanies: Company[];
}

const Home = ({ firstCompanies }: HomeProps) => {
  const [companies, setCompanies] = useState(firstCompanies);
  const certRef = useRef<string | null>(null);

  const onSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = ['certificate', 'name', 'city'].reduce((result: string[], key) => {
      const input = event.target?.[key] as HTMLInputElement;
      const value = input?.value;
      if (value) {
        if (key === 'certificate') {
          result.push(`${key}=${certRef.current}`);
        } else {
          result.push(`${key}=${value}`);
        }
      }
      return result;
    }, []);
    const result = await fetch(`/api/data?${query.join('&')}`);
    const { data } = await result.json();
    setCompanies(data);
  };

  return (
    <main>
      <Grid container direction="column" sx={{ minHeight: '100vh' }}>
        <Grid item xs={9} sm={10} md={11}>
          <form onSubmit={onSubmit}>
            <Grid container sx={{ my: '10px' }}>
              <Grid item>
                <TextField id="name" label="Yrityksen nimi tai y-tunnus" />
              </Grid>
              <Grid item>
                <Autocomplete
                  disableClearable
                  id="certificate"
                  options={certificates}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} label="Sertifikaatti" />}
                  onChange={(event, newValue) => {
                    if (certRef && 'current' in certRef) {
                      certRef.current = newValue.id;
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  disableClearable
                  id="city"
                  options={cities.cities}
                  renderInput={(params) => <TextField {...params} label="Kaupunki" />}
                />
              </Grid>
              <Grid item>
                <Button type="submit">Hae</Button>
              </Grid>
            </Grid>
          </form>
          <Grid container>
            {companies.map((company) => (
              <CompanyListItem company={company} key={company.name} />
            ))}
          </Grid>
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <Typography align="center">
            Business Finlandin mukaan sertifiointi on laadun tae kansainvälisessä kaupassa.
            Matkailualan monimuotoisuus on kuitenkin mahdollistanut sen, että myös sertifikaatin
            tarjoajia on hyvin paljon. Ideana on tuottaa nyt hankalasti ja pirstoutuneena oleva
            tieto yhteen paikkaan kaikkien toimijoiden avoimesti saataville.
          </Typography>
        </Grid>
      </Grid>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Get data from database
  const firstCompanies = await dbClient('company')
    .leftJoin('company_certificate', 'company.id', 'company_certificate.company_id')
    .whereNull('company.blacklisted')
    .orWhere('company.blacklisted', false)
    .select([
      'company.id as companyId',
      'company.name as name',
      'company.vat_number as vatNumber',
      'company.address as address',
      'company.post_code as postCode',
      'company.city as city',
      dbClient.raw(
        'ARRAY_REMOVE(ARRAY_AGG(company_certificate.certificate_id), NULL) as certificateId'
      ),
    ])
    .groupBy('company.id', 'company.name')
    .limit(100);

  return {
    props: {
      firstCompanies: firstCompanies,
    },
  };
};

export default Home;
