import React from 'react';
import { type Tooling } from './index.page';
import { Headline2 } from '~/components/Headlines';
import Link from 'next/link';
import { Preferences } from './usePreferences';

const ToolingTable = ({
  tools,
  preferences,
}: {
  tools: { [key: string]: Tooling[] };
  preferences: Preferences;
}) => {
  const categories = Object.keys(tools);
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
                        <Link href={`${item.source ?? item.homepage}`}>
                          {item.name}
                        </Link>
                        <div className='absolute left-0 top-full mt-2 w-64 p-4 bg-white border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
                          <p className='text-sm text-gray-700'>
                            {item.description}
                          </p>
                        </div>
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
