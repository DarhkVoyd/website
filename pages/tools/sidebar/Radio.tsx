import React, { ChangeEventHandler } from 'react';

export default function Radio({
  label,
  value,
  selectedValue,
  onChange,
}: {
  label: string;
  value: string;
  selectedValue: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label>
      {label}
      <input
        type='radio'
        value={value}
        checked={selectedValue === value}
        className='text-sm block py-1 pl-2 font-medium'
        onChange={onChange}
      />
    </label>
  );
}
