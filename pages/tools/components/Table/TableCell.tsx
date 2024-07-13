import React, { ReactNode } from 'react';

const TableCell = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return <td className='px-4 py-2 border-b border-gray-200'>{children}</td>;
};

export default TableCell;
