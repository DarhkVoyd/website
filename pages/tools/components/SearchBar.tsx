import React, { useEffect, useState } from 'react';
import { type Preferences } from '../lib/usePreferences';

const SearchBar = ({ preferences }: { preferences: Preferences }) => {
  const [query, setQuery] = useState(preferences.query);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    setQuery(preferences.query);
  }, [preferences.query]);

  return (
    <div className='w-full max-w-md mx-auto my-6 lg:my-auto'>
      <div className='relative'>
        <input
          type='text'
          className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300'
          placeholder='Search'
          name='query'
          value={query}
          onChange={changeHandler}
        />
      </div>
    </div>
  );
};

export default SearchBar;
