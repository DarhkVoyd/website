import React, { Dispatch, SetStateAction } from 'react';
import { type Tooling } from '../index.page';
import FilterByCategory from './FilterByCategory';

export default function FilterSidebar({
  categoriseBy,
  setCategoriseBy,
}: {
  categoriseBy: keyof Tooling;
  setCategoriseBy: Dispatch<SetStateAction<keyof Tooling>>;
}) {
  return (
    <div className='mx-auto lg:ml-4 lg:mt-8 w-4/5'>
      <FilterByCategory
        categoriseBy={categoriseBy}
        setCategoriseBy={setCategoriseBy}
      />
    </div>
  );
}
