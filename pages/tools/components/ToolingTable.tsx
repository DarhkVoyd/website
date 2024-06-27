import React, { useState } from 'react';
import { Headline2 } from '~/components/Headlines';
import ToolingDetailModal from './ToolingDetailModal';
import convertToTitleCase from '../lib/convertToTitleCase';
import { type Tooling } from '../lib/JSONSchemaTool';
import { type Preferences, type GroupedTools } from '../lib/usePreferences';

const ToolingTable = ({
  groupedTools,
  preferences,
}: {
  groupedTools: GroupedTools;
  preferences: Preferences;
}) => {
  const [selectedTool, setSelectedTool] = useState<Tooling | null>(null);

  const groups = Object.keys(groupedTools);

  const openModal = (tool: Tooling) => {
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
            <div className='mb-10 px-4 w-full bg-gray-100'>
              <Headline2 attributes={{ className: 'mt-[0px]' }}>
                {convertToTitleCase(group, '-')}
              </Headline2>
            </div>
          )}
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 border-b border-gray-200'>Name</th>
                  {preferences.groupBy !== 'toolingTypes' && (
                    <th className='px-4 py-2 border-b border-gray-200'>
                      Tooling Type
                    </th>
                  )}
                  {preferences.groupBy !== 'languages' && (
                    <th className='px-4 py-2 border-b border-gray-200'>
                      Languages
                    </th>
                  )}
                  <th className='px-4 py-2 border-b border-gray-200'>Drafts</th>
                  <th className='px-4 py-2 border-b border-gray-200'>
                    License
                  </th>
                  <th className='px-4 py-2 border-b border-gray-200'>Bowtie</th>
                </tr>
              </thead>
              <tbody>
                {groupedTools[group].map((tool, index) => (
                  <tr
                    key={index}
                    className='hover:bg-gray-100 cursor-pointer'
                    onClick={() => openModal(tool)}
                  >
                    <td className='px-4 py-2 border-b border-gray-200 relative group'>
                      {tool.name}
                    </td>
                    {preferences.groupBy !== 'toolingTypes' && (
                      <td className='px-4 py-2 border-b border-gray-200'>
                        {tool.toolingTypes
                          ?.map((type) => convertToTitleCase(type, '-'))
                          .join(', ')}
                      </td>
                    )}
                    {preferences.groupBy !== 'languages' && (
                      <td className='px-4 py-2 border-b border-gray-200'>
                        {tool.languages?.join(', ')}
                      </td>
                    )}
                    <td className='px-4 py-2 border-b border-gray-200'>
                      {tool.supportedDialects?.draft?.join(', ')}
                    </td>
                    <td className='px-4 py-2 border-b border-gray-200'>
                      {tool.license}
                    </td>
                    <td className='px-8 py-2 border-b border-gray-200'>
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
                    </td>
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
