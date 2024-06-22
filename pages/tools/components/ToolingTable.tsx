import React, { useState } from 'react';
import { type Tooling } from '../lib/JSONSchemaTool';
import { Headline2 } from '~/components/Headlines';
import { type Preferences } from '../lib/usePreferences';
import convertToTitleCase from '../lib/convertToTitleCase';
import ToolingDetailModal from './ToolingDetailModal';

const ToolingTable = ({
  tools,
  preferences,
}: {
  tools: { [key: string]: Tooling[] };
  preferences: Preferences;
}) => {
  const [selectedTool, setSelectedTool] = useState<Tooling | null>(null);

  const categories = Object.keys(tools);

  const openModal = (tool: Tooling) => {
    setSelectedTool(tool);
  };

  const closeModal = () => {
    setSelectedTool(null);
  };

  return (
    <>
      {categories.map((category) => (
        <section key={category} className='mb-12 text-left'>
          <div className='my-10 px-4 w-full bg-gray-100'>
            <Headline2>{convertToTitleCase(category, '-')}</Headline2>
          </div>
          <div>
            <table className='min-w-full bg-white border border-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 border-b border-gray-200'>Name</th>
                  {preferences.viewBy !== 'toolingTypes' && (
                    <th className='px-4 py-2 border-b border-gray-200'>
                      Tooling Type
                    </th>
                  )}
                  {preferences.viewBy !== 'languages' && (
                    <th className='px-4 py-2 border-b border-gray-200'>
                      Languages
                    </th>
                  )}
                  <th className='px-4 py-2 border-b border-gray-200'>Drafts</th>
                  <th className='px-4 py-2 border-b border-gray-200'>
                    License
                  </th>
                </tr>
              </thead>
              <tbody>
                {tools[category].map((item, index) => (
                  <tr key={index} className='hover:bg-gray-100'>
                    <td className='px-4 py-2 border-b border-gray-200 relative group'>
                      <div className='flex items-center justify-between'>
                        <a
                          href={item.source || item.homepage || '#'}
                          target='blank'
                          className='text-left'
                        >
                          {item.name}
                        </a>
                        <button
                          onClick={() => openModal(item)}
                          className='ml-2 text-gray-500 focus:outline-none'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            className='w-5 h-5 stroke-slate-600'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M13 16h-1v-4h-1m1-4h.01M12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z'
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    {preferences.viewBy !== 'toolingTypes' && (
                      <td className='px-4 py-2 border-b border-gray-200'>
                        {item.toolingTypes
                          ?.map((type) => convertToTitleCase(type, '-'))
                          .join(', ')}
                      </td>
                    )}
                    {preferences.viewBy !== 'languages' && (
                      <td className='px-4 py-2 border-b border-gray-200'>
                        {item.languages?.join(', ')}
                      </td>
                    )}
                    <td className='px-4 py-2 border-b border-gray-200'>
                      {item.supportedDialects?.draft?.join(', ')}
                    </td>
                    <td className='px-4 py-2 border-b border-gray-200'>
                      {item.license}
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
