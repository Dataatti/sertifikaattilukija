import { useState } from 'react';
import { Alert, Button, CircularProgress, Grid, Typography } from '@mui/material';
import CompanyListItem from 'components/CompanyListItem';
import { Print } from '@mui/icons-material';
import useLocalStorage from 'hooks/useLocalStorage';
import SearchForm from 'components/SearchForm';

const searchLimit = 50;

const Home = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [resultTotal, setResultTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [showInfo, setShowInfo] = useLocalStorage('showInfo', true);

  const showFetchMore = offset !== 0 || resultTotal > searchLimit;

  return (
    <main>
      {showInfo && (
        <Alert
          severity="info"
          onClose={() => setShowInfo(false)}
          sx={{ mt: '15px', displayPrint: 'none' }}
          data-testid="info-popup"
          className="print:hidden"
        >
          Tässä palvelussa voit hakea matkailualan yritysten suorittamia sertifikaatteja joko
          yrityksen nimen, y-tunnuksen, kaupungin tai sertifikaatin perusteella.
          <br />
          <br />
          Sertifikaattilukija on kokeiluversio, jonka takia kaikki sertifioidut tai STF-merkin
          saaneet yritykset eivät vielä löydy lukijan hakuehdoilla.
        </Alert>
      )}
      <SearchForm
        setCompanies={setCompanies}
        setResultTotal={setResultTotal}
        setLoading={setLoading}
        setOffset={setOffset}
        offset={offset}
        searchLimit={searchLimit}
        resultTotal={resultTotal}
      />
      {loading && offset === 0 ? (
        <Grid container item alignItems="center" justifyContent="center" sx={{ marginY: '10vh' }}>
          <CircularProgress aria-label="Ladataan" />
        </Grid>
      ) : (
        <>
          <Grid container item sx={{ my: '15px' }}>
            <Typography component="h3" variant="h5" data-testid="result-total" sx={{ mr: '10px' }}>
              Hakutulokset ({resultTotal} kpl)
            </Typography>
            <Button
              variant="contained"
              size="small"
              data-testid="print-button"
              onClick={() => window.print()}
              sx={{ displayPrint: 'none' }}
            >
              <Print /> Tulosta
            </Button>
          </Grid>
          <Grid
            container
            direction="column"
            sx={{ pt: '10px', pb: '30px' }}
            spacing={3}
            data-testid="company-list"
          >
            {companies?.map((company) => (
              <CompanyListItem company={company} key={company.name} />
            ))}
            {showFetchMore && (
              <Grid container justifyContent="center">
                {!loading ? (
                  <Button variant="outlined" onClick={() => setOffset(offset + searchLimit)}>
                    Hae lisää
                  </Button>
                ) : (
                  <CircularProgress aria-label="Ladataan" />
                )}
              </Grid>
            )}
          </Grid>
        </>
      )}
    </main>
  );
};

export default Home;
