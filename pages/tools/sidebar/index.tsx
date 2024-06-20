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
  function setViewBy() {}
  const viewBy = 'toolingType';
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setViewBy(event.target.value as keyof Tooling);
  };

  return (
    <div className='sticky top-12 mx-auto lg:ml-4 lg:mt-8 w-4/5'>
      <SearchBar preferences={preferences} setPreferences={setPreferences} />
      <FilterMenu label='View'>
        <Radio
          label='Tooling Type'
          value='toolingType'
          selectedValue={viewBy}
          onChange={handleChange}
        />
        <Radio
          label='Language'
          value='languages'
          selectedValue={viewBy}
          onChange={handleChange}
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
