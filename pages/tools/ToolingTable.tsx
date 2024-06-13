import React from 'react';
import { type Tooling } from './index.page';
import { Headline1 } from '~/components/Headlines';

const ToolingTable = ({ items }: { items: Tooling[] }) => {
  const sortedTooling = categoriseTooling(items);
  const categories = Object.keys(sortedTooling);
  return (
    <div className='overflow-x-auto'>
      {categories.map((category) => {
        return (
          <div key={category}>
            <Headline1>{category.split('-').join(' ')}</Headline1>
            <div>
              <table className='min-w-full bg-white border border-gray-200'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 border-b border-gray-200'>Name</th>
                    <th className='px-4 py-2 border-b border-gray-200'>
                      Languages
                    </th>
                    <th className='px-4 py-2 border-b border-gray-200'>
                      Drafts
                    </th>
                    <th className='px-4 py-2 border-b border-gray-200'>
                      License
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTooling[category].map((item, index) => (
                    <tr key={index} className='hover:bg-gray-100'>
                      <td className='px-4 py-2 border-b border-gray-200 relative group'>
                        {item.name}
                        <div className='absolute left-0 top-full mt-2 w-64 p-4 bg-white border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
                          <p className='text-sm text-gray-700'>
                            {item.description}
                          </p>
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
          </div>
        );
      })}
    </div>
  );
};

function categoriseTooling(
  tools: Tooling[],
  categoriseBy: keyof Tooling = 'toolingType',
) {
  const categorisedTooling: { [key: string]: Tooling[] } = {};

  tools.forEach((tool: Tooling) => {
    if (Array.isArray(tool[categoriseBy])) {
      (tool[categoriseBy] as string[]).forEach((category: string) => {
        if (!categorisedTooling[category]) {
          categorisedTooling[category] = [];
        }
        categorisedTooling[category].push(tool);
      });
    }
  });

  return categorisedTooling;
}

export default ToolingTable;
