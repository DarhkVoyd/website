import React, { useState } from 'react';
import { Headline2 } from '~/components/Headlines';
import ToolingDetailModal from './ToolingDetailModal';
import convertToTitleCase from '../lib/convertToTitleCase';
import { type Tooling } from '../lib/JSONSchemaTool';
import { type Preferences, type CategorisedTools } from '../lib/usePreferences';

const ToolingTable = ({
  categorisedTools,
  preferences,
}: {
  categorisedTools: CategorisedTools;
  preferences: Preferences;
}) => {
  const [selectedTool, setSelectedTool] = useState<Tooling | null>(null);

  const categories = Object.keys(categorisedTools);

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
                  <th className='px-4 py-2 border-b border-gray-200'>Bowtie</th>
                </tr>
              </thead>
              <tbody>
                {categorisedTools[category].map((tool, index) => (
                  <tr
                    key={index}
                    className='hover:bg-gray-100 cursor-pointer'
                    onClick={() => openModal(tool)}
                  >
                    <td className='px-4 py-2 border-b border-gray-200 relative group'>
                      {tool.name}
                    </td>
                    {preferences.viewBy !== 'toolingTypes' && (
                      <td className='px-4 py-2 border-b border-gray-200'>
                        {tool.toolingTypes
                          ?.map((type) => convertToTitleCase(type, '-'))
                          .join(', ')}
                      </td>
                    )}
                    {preferences.viewBy !== 'languages' && (
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
                    <td className='px-4 py-2 border-b border-gray-200'>
                      <a
                        href={`https://bowtie.report/#/implementations/${tool.bowtie?.identifier}`}
                        target='blank'
                      >
                        Click Here
                      </a>
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
