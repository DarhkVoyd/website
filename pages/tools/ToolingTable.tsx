import React, { useState } from 'react';
import { type Tooling } from './index.page';
import { Headline2 } from '~/components/Headlines';
import Link from 'next/link';
import { Preferences } from './usePreferences';

const Modal = ({ tool, onClose }) => (
  <div className='fixed inset-0 flex items-center justify-center z-50'>
    <div className='fixed inset-0 bg-black opacity-50' onClick={onClose}></div>
    <div className='bg-white rounded-lg p-8 max-w-lg w-full relative z-50'>
      <div className='flex justify-end absolute top-0 right-0 mt-4 mr-4'>
        <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
          <svg
            className='h-6 w-6 fill-current'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
          >
            <path
              className='heroicon-ui'
              d='M6.293 7.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z'
            />
          </svg>
        </button>
      </div>
      <div className='mt-4'>
        <h2 className='text-xl font-bold'>{tool.name}</h2>
        <p className='text-gray-700 mt-2'>{tool.description}</p>
        {/* Additional tool details can be displayed here */}
      </div>
    </div>
  </div>
);

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
                        {item.supportedDialects?.draft.join(', ')}
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
      {selectedTool && <Modal tool={selectedTool} onClose={closeModal} />}
    </>
  );
};

export function toTitleCase(str: string) {
  return str
    .split(' ')
    .map(function (word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export default ToolingTable;
