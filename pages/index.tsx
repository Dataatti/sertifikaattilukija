import type { GetStaticProps, NextApiResponse } from 'next';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { Alert, Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { databaseHoc, getCompanies, NextRequestWithDb } from 'utils/database';
import cities from 'enums/cities.json';
import certificates from 'enums/certificates.json';
import CompanyListItem from 'components/CompanyListItem';
import { Print, Search } from '@mui/icons-material';
import useLocalStorage from 'hooks/useLocalStorage';

interface HomeProps {
  firstCompanies: Company[];
  initialResultsAmount: number;
}

const Home = ({ firstCompanies, initialResultsAmount }: HomeProps) => {
  const [companies, setCompanies] = useState(firstCompanies);
  const [resultTotal, setResultTotal] = useState(initialResultsAmount);
  const [showInfo, setShowInfo] = useLocalStorage('showInfo', true);
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
    const { data, totalResults } = await result.json();
    setCompanies(data);
    setResultTotal(totalResults);
  };

  return (
    <main>
      {showInfo && (
        <Alert severity="info" onClose={() => setShowInfo(false)} sx={{ mt: '15px' }}>
          Tässä palvelussa voit hakea matkailualan yritysten suorittamia ympäristösertifikaatteja
          joko yrityksen nimen, y-tunnuksen, kaupungin tai sertifikaatin perusteella.
        </Alert>
      )}
      <form onSubmit={onSubmit}>
        <Typography component="h2" variant="h6" sx={{ pt: '10px' }}>
          Rajaa tuloksia
        </Typography>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ pt: '5px', pb: '15px', borderBottom: '1px solid #C4C4C4' }}
        >
          <Grid item xs={8} sm={5}>
            <TextField id="name" fullWidth label="Yrityksen nimi tai y-tunnus" />
          </Grid>
          <Grid item xs={4} sm={3}>
            <Autocomplete
              disableClearable
              fullWidth
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
          <Grid item xs={8} sm={3}>
            <Autocomplete
              disableClearable
              fullWidth
              id="city"
              options={cities.cities}
              renderInput={(params) => <TextField {...params} label="Kaupunki" />}
            />
          </Grid>
          <Grid item xs={4} sm={1}>
            <Button type="submit" variant="contained" fullWidth size="large">
              <Search /> Hae
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container item sx={{ my: '15px' }}>
        <Typography component="h3" variant="h5" sx={{ mr: '10px' }}>
          Hakutulokset ({resultTotal} kpl)
        </Typography>
        <Button variant="contained" size="small" onClick={() => window.print()}>
          <Print /> Tulosta
        </Button>
      </Grid>
      <Grid container direction="column" sx={{ pt: '10px', pb: '30px' }} spacing={3}>
        {companies?.map((company) => (
          <CompanyListItem company={company} key={company.name} />
        ))}
      </Grid>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Get data from database
  const limit = 20;
  const hoc = databaseHoc()(async (req) => {
    const { companies } = await getCompanies(req.db, limit);
    return companies;
  });
  const firstCompanies = await hoc({} as NextRequestWithDb, {} as NextApiResponse);
  return {
    props: {
      firstCompanies,
      initialResultsAmount: limit,
    },
  };
};

export default Home;
