import React from 'react';

export default function Checkbox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <label className='flex items-center gap-3 px-4 py-2'>
      <input type='checkbox' value={value} checked={checked} id={value} />
      <span className='text-gray-700 font-medium'>{label}</span>
    </label>
  );
}
