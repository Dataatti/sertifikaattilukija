/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { FormEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import cities from 'enums/cities.json';
import certificates from 'enums/certificates.json';
import { Search } from '@mui/icons-material';
import { useRouter } from 'next/router';

const SearchForm = ({
  setCompanies,
  setResultTotal,
  setLoading,
  setOffset,
  offset,
  searchLimit,
}: {
  setCompanies: Dispatch<SetStateAction<Company[]>>;
  setResultTotal: Dispatch<SetStateAction<number>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setOffset: Dispatch<SetStateAction<number>>;
  offset: number;
  searchLimit: number;
}) => {
  const router = useRouter();
  const [company, setCompany] = useState('');
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);
  const [fetchPreSelected, setFetchPreSelected] = useState(false);

  useEffect(() => {
    if (router.isReady && router.query.cert) {
      const preSelectedCert: Certificate | undefined = certificates.find(
        (certificate) => certificate.id === router.query.cert
      );
      preSelectedCert && setCerts([preSelectedCert]);
      setFetchPreSelected(true);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (fetchPreSelected && certs[0].id === router.query.cert) {
      onSubmit();
      setFetchPreSelected(false);
    }
  }, [fetchPreSelected]);

  useEffect(() => {
    if (offset > 0) {
      onSubmit();
    }
  }, [offset]);

  const onSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setLoading(true);
    let query = [`limit=${searchLimit}`];

    if (company !== '') {
      query.push(`name=${company}`);
    }
    if (certs.length !== 0) {
      const certIds = certs.map((cert) => cert.id);
      query.push(`certificate=${certIds}`);
    }
    if (areas.length !== 0) {
      const areaIds = areas.map((area) => area.id);
      query.push(`city=${areaIds}`);
    }
    if (offset !== 0) {
      query.push(`offset=${offset}`);
    }

    const request = new Request(`https://sertifikaattilukija.herokuapp.com/data?${query.join('&')}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    const result = await fetch(request);
    const { data, totalResults, resultsFrom } = await result.json();

    if (offset !== 0) {
      setCompanies((prevCompanies) => [...prevCompanies, ...data]);
    } else {
      setCompanies(data);
    }

    setResultTotal(totalResults);
    setLoading(false);
    setOffset(resultsFrom);
  };

  return (
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
        <Grid item xs={7} sm={4}>
          <TextField
            id="name"
            data-testid="name"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            fullWidth
            label="Yrityksen nimi tai y-tunnus"
          />
        </Grid>
        <Grid item xs={5} sm={4}>
          <Autocomplete
            id="certificate"
            data-testid="certificate"
            value={certs}
            onChange={(event, newValue) => {
              setCerts([...newValue]);
            }}
            multiple
            limitTags={1}
            disableClearable
            fullWidth
            options={certificates}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Sertifikaatti" />}
          />
        </Grid>
        <Grid item xs={8} sm={3}>
          <Autocomplete
            id="city"
            data-testid="city"
            value={areas}
            onChange={(event, newValue) => {
              setAreas([...newValue]);
            }}
            multiple
            limitTags={2}
            disableClearable
            fullWidth
            options={cities}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Kunta/Maakunta" />}
          />
        </Grid>
        <Grid item xs={4} sm={1}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            data-testid="submit-button"
          >
            <Search /> Hae
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchForm;
