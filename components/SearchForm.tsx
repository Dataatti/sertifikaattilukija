import { Alert, Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState, useRef } from 'react';
import cities from 'enums/cities.json';
import certificates from 'enums/certificates.json';
import { Search } from '@mui/icons-material';

const SearchForm = ({
  setCompanies,
  setResultTotal,
}: {
  setCompanies: Dispatch<SetStateAction<Company[]>>;
  setResultTotal: Dispatch<SetStateAction<number>>;
}) => {
  const [company, setCompany] = useState('');
  const [certs, setCerts] = useState<{ id: string; name: string }[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  const onSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    let query = [];

    if (company !== '') {
      query.push(`name=${company}`);
    }
    if (certs !== []) {
      const certIds = certs.map((cert) => cert.id);
      query.push(`certificate=${certIds}`);
    }
    if (areas !== []) {
      query.push(`city=${areas}`);
    }

    const result = await fetch(`/api/data?${query.join('&')}`);
    const { data, totalResults } = await result.json();
    setCompanies(data);
    setResultTotal(totalResults);
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
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            fullWidth
            label="Yrityksen nimi tai y-tunnus"
          />
        </Grid>
        <Grid item xs={5} sm={4}>
          <Autocomplete
            id="certificate"
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
            value={areas}
            onChange={(event, newValue) => {
              setAreas([...newValue]);
            }}
            multiple
            limitTags={2}
            disableClearable
            fullWidth
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
  );
};

export default SearchForm;
