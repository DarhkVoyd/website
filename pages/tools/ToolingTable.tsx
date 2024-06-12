import React from 'react';
import { type Tooling } from './index.page';

const ToolingTable = ({ items }: { items: Tooling[] }) => {
  function groupByType(tools: Tooling[]) {
    const grouped = {};

    tools.forEach((tool) => {
      tool.toolingType.forEach((type) => {
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push(tool.name);
      });
    });

    return grouped;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white border border-gray-200'>
        <thead>
          <tr>
            <th className='px-4 py-2 border-b border-gray-200'>Validator</th>
            <th className='px-4 py-2 border-b border-gray-200'>Languages</th>
            <th className='px-4 py-2 border-b border-gray-200'>Drafts</th>
            <th className='px-4 py-2 border-b border-gray-200'>License</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className='hover:bg-gray-100'>
              <td className='px-4 py-2 border-b border-gray-200 relative group'>
                {item.name}
                <div className='absolute left-0 top-full mt-2 w-64 p-4 bg-white border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
                  <p className='text-sm text-gray-700'>{item.description}</p>
                </div>
              </td>
              <td className='px-4 py-2 border-b border-gray-200'>
                {item.languages && item.languages.join(', ')}
              </td>
              <td className='px-4 py-2 border-b border-gray-200'>
                {item.supportedDialects &&
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
  );
};

export default ToolingTable;
