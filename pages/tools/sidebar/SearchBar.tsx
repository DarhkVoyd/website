import React, { Dispatch, SetStateAction, useState } from 'react';
import Fuse from 'fuse.js';
import { Tooling } from '../index.page';

interface SearchBarProps {
  toolingData: Tooling[];
  setFilteredToolingData: Dispatch<SetStateAction<Tooling[]>>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  toolingData,
  setFilteredToolingData,
}) => {
  const [query, setQuery] = useState('');

  const fuse = new Fuse(toolingData, {
    keys: ['name'],
    includeScore: true,
    threshold: 0.3, // Adjust the threshold for fuzziness
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.trim() === '') {
      setFilteredToolingData(toolingData);
    } else {
      const searchResults = fuse
        .search(searchQuery)
        .map((result) => result.item);
      setFilteredToolingData(searchResults);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto my-6 lg:my-auto'>
      <div className='relative'>
        <input
          type='text'
          className='w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300'
          placeholder='Search'
          value={query}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
