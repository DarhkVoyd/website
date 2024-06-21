import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Preferences, type Tooling } from '../index.page';
import FilterMenu from './FilterMenu';
import Radio from './Radio';
import SearchBar from './SearchBar';
import { toTitleCase } from '../ToolingTable';
import Checkbox from './Checkbox';
import { Fields, UniqueValuesPerField } from '../getUniqueValuesPerField';

export default function FilterSidebar({
  uniqueValuesPerField,
  preferences,
  setPreferences,
}: {
  uniqueValuesPerField: UniqueValuesPerField;
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
}) {
  const viewBy = preferences.viewBy;
  const setViewPreference = (event: ChangeEvent<HTMLInputElement>) => {
    setPreferences((prev) => ({
      ...prev,
      viewBy: event.target.value as typeof viewBy,
    }));
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
          label='Tooling Type'
          value='toolingTypes'
          selectedValue={viewBy}
          onChange={setViewPreference}
        />
        <Radio
          label='Language'
          value='languages'
          selectedValue={viewBy}
          onChange={setViewPreference}
        />
      </FilterMenu>
      {Object.keys(uniqueValuesPerField).map((field) => {
        const values = uniqueValuesPerField[field as Fields];
        const label = field.split('.').pop();
        return (
          <FilterMenu key={field} label={toTitleCase(label!)}>
            {values &&
              values.map((uniqueValue) => (
                <Checkbox
                  key={uniqueValue}
                  label={uniqueValue}
                  value={uniqueValue}
                />
              ))}
          </FilterMenu>
        );
      })}
    </div>
  );
}
