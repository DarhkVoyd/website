import React, { useState } from 'react';
import { type Tooling } from '../lib/JSONSchemaTool';
import { Headline2 } from '~/components/Headlines';
import { type Preferences } from '../lib/usePreferences';
import toTitleCase from '../lib/toTitleCase';
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
      {categories.map((category) => {
        return (
          <section key={category} className='mb-12 text-left'>
            <div className='my-10 px-4 w-full bg-gray-100'>
              <Headline2>{toTitleCase(category.replace(/-/g, ' '))}</Headline2>
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
                    <th className='px-4 py-2 border-b border-gray-200'>
                      Drafts
                    </th>
                    <th className='px-4 py-2 border-b border-gray-200'>
                      License
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tools[category].map((item, index) => (
                    <tr key={index} className='hover:bg-gray-100'>
                      <td className='px-4 py-2 border-b border-gray-200 relative group'>
                        <button
                          onClick={() => openModal(item)}
                          className='text-left focus:outline-none'
                        >
                          {item.name}
                        </button>
                      </td>
                      {preferences.viewBy !== 'toolingTypes' && (
                        <td className='px-4 py-2 border-b border-gray-200'>
                          {item.toolingTypes
                            ?.map((type) => {
                              return toTitleCase(type.replace(/-/g, ' '));
                            })
                            .join(', ')}
                        </td>
                      )}
                      {preferences.viewBy !== 'languages' && (
                        <td className='px-4 py-2 border-b border-gray-200'>
                          {item.languages?.join(', ')}
                        </td>
                      )}
                      <td className='px-4 py-2 border-b border-gray-200'>
                        {item.supportedDialects &&
                          item.supportedDialects.draft &&
                          item.supportedDialects.draft.join(', ')}
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
        );
      })}
      {selectedTool && (
        <ToolingDetailModal tool={selectedTool} onClose={closeModal} />
      )}
    </>
  );
};

export default ToolingTable;
