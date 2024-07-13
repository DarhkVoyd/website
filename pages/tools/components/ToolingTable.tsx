import React, { Dispatch, SetStateAction, useState } from 'react';
import { Headline2 } from '~/components/Headlines';
import {
  TableColumnHeader,
  TableSortableColumnHeader,
  TableCell,
} from './Table';
import ToolingDetailModal from './ToolingDetailModal';
import Badge from './ui/Badge';
import type { GroupedTools, Preferences } from '../hooks/usePreferences';
import { type JSONSchemaTool, convertToTitleCase } from '../lib';

const ToolingTable = ({
  groupedTools,
  preferences,
  setPreferences,
}: {
  groupedTools: GroupedTools;
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
}) => {
  const [selectedTool, setSelectedTool] = useState<JSONSchemaTool | null>(null);

  const groups = Object.keys(groupedTools);

  const openModal = (tool: JSONSchemaTool) => {
    setSelectedTool(tool);
  };

  const closeModal = () => {
    setSelectedTool(null);
  };

  const outlinkIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      className='w-5 h-5'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M14 3h7m0 0v7m0-7L10 14m1-9H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-6'
      />
    </svg>
  );

  const notAvailableIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      className='w-5 h-5'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M6 18L18 6M6 6l12 12'
      />
    </svg>
  );

  return (
    <>
      {groups.map((group) => (
        <section key={group} className='mb-12 text-left'>
          {group !== 'none' && (
            <div className='mb-10 px-4 w-full bg-gray-100 dark:bg-slate-900'>
              <Headline2 attributes={{ className: 'mt-[0px]' }}>
                {convertToTitleCase(group, '-')}
              </Headline2>
            </div>
          )}
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white dark:bg-slate-800 border border-gray-200'>
              <thead>
                <tr>
                  <TableSortableColumnHeader
                    sortBy='name'
                    preferences={preferences}
                    setPreferences={setPreferences}
                  >
                    Name
                  </TableSortableColumnHeader>
                  {preferences.groupBy !== 'toolingTypes' && (
                    <TableColumnHeader>Tooling Type</TableColumnHeader>
                  )}
                  {preferences.groupBy !== 'languages' && (
                    <TableColumnHeader>Languages</TableColumnHeader>
                  )}
                  <TableColumnHeader>Drafts</TableColumnHeader>
                  <TableSortableColumnHeader
                    sortBy='license'
                    preferences={preferences}
                    setPreferences={setPreferences}
                  >
                    License
                  </TableSortableColumnHeader>
                  <TableColumnHeader>Bowtie</TableColumnHeader>
                </tr>
              </thead>
              <tbody>
                {groupedTools[group].map((tool: JSONSchemaTool, index) => (
                  <tr
                    key={index}
                    className='hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer'
                    onClick={() => openModal(tool)}
                  >
                    <TableCell>{tool.name}</TableCell>
                    {preferences.groupBy !== 'toolingTypes' && (
                      <TableCell>
                        {tool.toolingTypes
                          ?.map((type) => convertToTitleCase(type, '-'))
                          .join(', ')}
                      </TableCell>
                    )}
                    {preferences.groupBy !== 'languages' && (
                      <TableCell>{tool.languages?.join(', ')}</TableCell>
                    )}
                    <TableCell>
                      {tool.supportedDialects?.draft?.map((draft) => {
                        return <Badge key={draft}>{draft}</Badge>;
                      })}
                    </TableCell>
                    <TableCell>{tool.license}</TableCell>
                    <TableCell>
                      {tool.bowtie?.identifier ? (
                        <a
                          href={`https://bowtie.report/#/implementations/${tool.bowtie?.identifier}`}
                          target='blank'
                          onClick={(event) => event.stopPropagation()}
                        >
                          {outlinkIcon}
                        </a>
                      ) : (
                        <span>{notAvailableIcon}</span>
                      )}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      {selectedTool && (
        <ToolingDetailModal tool={selectedTool} onClose={closeModal} />
      )}
    </>
  );
};

export default ToolingTable;
