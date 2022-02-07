import type { GetStaticProps, NextApiResponse } from 'next';
import { useState } from 'react';
import { Alert, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { databaseHoc, getCompanies, NextRequestWithDb } from 'utils/database';
import CompanyListItem from 'components/CompanyListItem';
import { Print } from '@mui/icons-material';
import useLocalStorage from 'hooks/useLocalStorage';
import SearchForm from 'components/SearchForm';

interface HomeProps {
  firstCompanies: Company[];
  initialResultsAmount: number;
}

const Home = ({ firstCompanies, initialResultsAmount }: HomeProps) => {
  const [companies, setCompanies] = useState(firstCompanies);
  const [resultTotal, setResultTotal] = useState(initialResultsAmount);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useLocalStorage('showInfo', true);

  return (
    <main>
      {showInfo && (
        <Alert severity="info" onClose={() => setShowInfo(false)} sx={{ mt: '15px' }}>
          Tässä palvelussa voit hakea matkailualan yritysten suorittamia ympäristösertifikaatteja
          joko yrityksen nimen, y-tunnuksen, kaupungin tai sertifikaatin perusteella.
        </Alert>
      )}
      <SearchForm
        setCompanies={setCompanies}
        setResultTotal={setResultTotal}
        setLoading={setLoading}
      />
      {loading ? (
        <Grid container item alignItems="center" justifyContent="center" sx={{ marginY: '10vh' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
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
        </>
      )}
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
