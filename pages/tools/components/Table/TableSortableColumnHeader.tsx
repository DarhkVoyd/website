import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import TableColumnHeader from './TableColumnHeader';
import { Preferences } from '../../hooks/usePreferences';

const TableSortableColumnHeader = ({
  sortBy,
  preferences,
  setPreferences,
  children,
}: {
  sortBy: Preferences['sortBy'];
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
  children: ReactNode;
}) => {
  const [isSortedBy, setIsSortedBy] = useState(preferences.sortBy === sortBy);
  const [sortOrder, setSortOrder] = useState<Preferences['sortOrder']>('none');

  useEffect(() => {
    setIsSortedBy(preferences.sortBy === sortBy);
    setSortOrder('none');
  }, [preferences.sortBy]);

  const sortByColumn = () => {
    setSortOrder((prevSortOrder) => {
      const newSortOrder =
        prevSortOrder === 'none' || prevSortOrder === 'descending'
          ? 'ascending'
          : 'descending';

      setPreferences((prevPreferences) => ({
        ...prevPreferences,
        sortBy,
        sortOrder: newSortOrder,
      }));

      return newSortOrder;
    });

    setIsSortedBy(true);
  };

  const rotateClass = sortOrder === 'ascending' ? 'rotate-180' : '';

  return (
    <TableColumnHeader>
      <button
        className='flex items-center focus:outline-none'
        onClick={sortByColumn}
      >
        {children}
        {isSortedBy && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className={`w-4 h-4 ml-1 transform ${rotateClass}`}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 15l7-7 7 7'
            />
          </svg>
        )}
      </button>
    </TableColumnHeader>
  );
};

export default TableSortableColumnHeader;
