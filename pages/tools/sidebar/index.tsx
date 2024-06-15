import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { type Tooling } from '../index.page';
import FilterMenu from './FilterMenu';
import Radio from './Radio';
import SearchBar from './SearchBar';
import { type DataDomains } from '../collectDataDomains';
import { toTitleCase } from '../ToolingTable';
import Checkbox from './Checkbox';

export default function FilterSidebar({
  dataDomains,
  toolingData,
  setFilteredToolingData,
  categoriseBy,
  setCategoriseBy,
}: {
  dataDomains: DataDomains;
  toolingData: Tooling[];
  setFilteredToolingData: Dispatch<SetStateAction<Tooling[]>>;
  categoriseBy: keyof Tooling;
  setCategoriseBy: Dispatch<SetStateAction<keyof Tooling>>;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCategoriseBy(event.target.value as keyof Tooling);
  };

  return (
    <div className='sticky top-12 mx-auto lg:ml-4 lg:mt-8 w-4/5'>
      <SearchBar
        toolingData={toolingData}
        setFilteredToolingData={setFilteredToolingData}
      />
      <FilterMenu label='View'>
        <Radio
          label='Tooling Type'
          value='toolingType'
          selectedValue={categoriseBy}
          onChange={handleChange}
        />
        <Radio
          label='Language'
          value='languages'
          selectedValue={categoriseBy}
          onChange={handleChange}
        />
      </FilterMenu>
      {Object.keys(dataDomains).map((field) => {
        const domain = field as keyof DataDomains;
        return (
          <FilterMenu key={field} label={toTitleCase(field)}>
            {dataDomains[domain]!.map((dataDomainValue: string) => (
              <Checkbox
                key={dataDomainValue}
                label={dataDomainValue}
                value={dataDomainValue}
              />
            ))}
          </FilterMenu>
        );
      })}
    </div>
  );
}
