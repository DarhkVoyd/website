import React, { ReactNode } from 'react';

const TableColumnHeader = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  return <th className='px-4 py-2 border-b border-gray-200'>{children}</th>;
};

export default TableColumnHeader;
