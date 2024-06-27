import React, { Dispatch, SetStateAction, useRef } from 'react';
import DropdownMenu from './DropdownMenu';
import SearchBar from './SearchBar';
import Checkbox from './Checkbox';
import {
  type Fields,
  type UniqueValuesPerField,
} from '../lib/getUniqueValuesPerField';
import { type Preferences } from '../lib/usePreferences';
import convertToTitleCase from '../lib/convertToTitleCase';

export default function Sidebar({
  uniqueValuesPerField,
  preferences,
  setPreferences,
  resetPreferences,
}: {
  uniqueValuesPerField: UniqueValuesPerField;
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
  resetPreferences: () => void;
}) {
  const filterFormRef = useRef<HTMLFormElement>(null);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterFormRef.current) return;
    const formData = new FormData(filterFormRef.current);

    setPreferences((prev) => {
      const updatedPreferences: Preferences = {
        query: (formData.get('query') as Preferences['query']) || '',
        groupBy: prev.groupBy || 'toolingTypes',
        sortBy: prev.sortBy || 'none',
        languages: formData.getAll('languages').map((value) => value as string),
        license: formData.getAll('license').map((value) => value as string),
        'supportedDialects.draft': formData
          .getAll('supportedDialects.draft')
          .map((value) => value as string),
      };
      return updatedPreferences;
    });
  };

  const resetHandler = () => {
    if (!filterFormRef.current) return;
    filterFormRef.current.reset();
    resetPreferences();
  };

  return (
    <div className='pb-4 top-12 mx-auto lg:ml-4 lg:mt-8 w-4/5 h-fit'>
      <form onSubmit={submitHandler} ref={filterFormRef} className='w-full'>
        <SearchBar preferences={preferences} />
        {Object.keys(uniqueValuesPerField).map((field) => {
          const values = uniqueValuesPerField[field as Fields];
          const label = field.split('.').pop();
          return (
            <DropdownMenu
              key={field}
              label={convertToTitleCase(label!)}
              iconSrc='/icons/filter.svg'
              iconAlt='Filter Icon'
            >
              {values &&
                values.map((uniqueValue) => (
                  <Checkbox
                    key={uniqueValue}
                    label={uniqueValue}
                    value={uniqueValue}
                    name={field}
                  />
                ))}
            </DropdownMenu>
          );
        })}
        <div className='w-full flex items-center justify-between mt-4'>
          <button
            type='submit'
            className='bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none'
          >
            Apply Filters
          </button>
          <button
            type='button'
            className='bg-slate-200 text-gray-700 px-4 py-2 rounded hover:bg-slate-300 focus:outline-none'
            onClick={resetHandler}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
}
