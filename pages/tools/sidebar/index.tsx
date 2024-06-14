import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { type Tooling } from '../index.page';
import FilterMenu from './FilterMenu';
import Radio from './Radio';

export default function FilterSidebar({
  categoriseBy,
  setCategoriseBy,
}: {
  categoriseBy: keyof Tooling;
  setCategoriseBy: Dispatch<SetStateAction<keyof Tooling>>;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCategoriseBy(event.target.value as keyof Tooling);
  };

  return (
    <div className='sticky top-12 mx-auto lg:ml-4 lg:mt-8 w-4/5'>
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
    </div>
  );
}
