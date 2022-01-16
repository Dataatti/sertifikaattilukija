import { useState } from 'react';
import { Autocomplete, Button, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchInput = ({ searchOptions } : string[] ) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={searchOptions}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      renderInput={(params) => (
        <TextField
          {...params}
          type="search"
          fullWidth
          label="Yrityksen nimi / y-tunnus tai sertifikaatti tai kunta"
          InputProps={{
            ...params.InputProps,
            sx:{ paddingRight: '1px !important' },
            endAdornment: (
              <InputAdornment position="end">
                <Button type="submit" color="primary" variant="contained" sx={{ height: '54px', borderRadius: '3px' }}>
                  Hae
                  <Search/>
                </Button>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  )
}

export default SearchInput;
