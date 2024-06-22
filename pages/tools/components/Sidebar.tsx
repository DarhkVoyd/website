import React, { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import FilterMenu from './FilterMenu';
import Radio from './Radio';
import SearchBar from './SearchBar';
import Checkbox from './Checkbox';
import {
  type Fields,
  type UniqueValuesPerField,
} from '../lib/getUniqueValuesPerField';
import { type Preferences } from '../lib/usePreferences';
import convertToTitleCase from '../lib/convertToTitleCase';

export default function FilterSidebar({
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
  const viewBy = preferences.viewBy;
  const setViewPreference = (event: ChangeEvent<HTMLInputElement>) => {
    setPreferences((prev) => ({
      ...prev,
      viewBy: event.target.value as typeof viewBy,
    }));
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterFormRef.current) return;
    const formData = new FormData(filterFormRef.current);
    const formValues: Record<string, string[]> = {};

    setPreferences((prev) => {
      formData.forEach((value, key) => {
        if (!formValues[key]) {
          formValues[key] = [];
        }
        formValues[key].push(value as string);
      });
      return {
        ...prev,
        ...formValues,
      };
    });
  };

  const resetHandler = () => {
    if (!filterFormRef.current) return;
    filterFormRef.current.reset();
    resetPreferences();
  };

  return (
    <div className='top-12 mx-auto lg:ml-4 lg:mt-8 w-4/5'>
      <SearchBar preferences={preferences} setPreferences={setPreferences} />
      <FilterMenu label='View'>
        <Radio
          label='All'
          value='all'
          selectedValue={viewBy}
          onChange={setViewPreference}
        />
        <Radio
          label='Tooling Types'
          value='toolingTypes'
          selectedValue={viewBy}
          onChange={setViewPreference}
        />
        <Radio
          label='Languages'
          value='languages'
          selectedValue={viewBy}
          onChange={setViewPreference}
        />
        <Radio
          label='Environments'
          value='environments'
          selectedValue={viewBy}
          onChange={setViewPreference}
        />
      </FilterMenu>
      <form onSubmit={submitHandler} ref={filterFormRef} className='w-full'>
        {Object.keys(uniqueValuesPerField).map((field) => {
          const values = uniqueValuesPerField[field as Fields];
          const label = field.split('.').pop();
          return (
            <FilterMenu key={field} label={convertToTitleCase(label!)}>
              {values &&
                values.map((uniqueValue) => (
                  <Checkbox
                    key={uniqueValue}
                    label={uniqueValue}
                    value={uniqueValue}
                    name={field}
                  />
                ))}
            </FilterMenu>
          );
        })}
        <div className='w-full flex items-center justify-between gap-4'>
          <button
            type='button'
            className='text-sm text-gray-600 italic hover:underline hover:text-gray-800 focus:outline-none'
            onClick={resetHandler}
          >
            Clear Filters
          </button>
          <button type='submit' className='bg-gray-300 px-4 py-2 rounded'>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
