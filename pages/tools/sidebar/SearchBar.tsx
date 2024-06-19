import React, { Dispatch, SetStateAction } from 'react';
import { Preferences } from '../index.page';

interface SearchBarProps {
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
}

const SearchBar = ({ preferences, setPreferences }: SearchBarProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setPreferences((prev: Preferences) => ({
      ...prev,
      query: searchQuery,
    }));
  };

  return (
    <div className='w-full max-w-md mx-auto my-6 lg:my-auto'>
      <div className='relative'>
        <input
          type='text'
          className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300'
          placeholder='Search'
          value={preferences.query}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
