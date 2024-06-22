import React, { useEffect } from 'react';
import { Tooling } from '../lib/JSONSchemaTool';

export default function ToolingDetailModal({
  tool,
  onClose,
}: {
  tool: Tooling;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden'>
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>
      <div
        className='bg-white rounded-lg p-8 max-w-full lg:max-w-4xl w-3/4 lg:w-full relative top-8 z-50 max-h-[80vh] overflow-y-auto'
        style={{ overflowWrap: 'anywhere' }}
      >
        <div className='flex justify-end absolute top-0 right-0 mt-4 mr-4'>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
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
          <h2 className='text-2xl font-bold'>{tool.name}</h2>
          {tool.description && (
            <p className='text-gray-600 mt-1 text-base'>{tool.description}</p>
          )}
        </div>
        <div className='flex flex-row mt-6'>
          <div className='w-1/2 pr-4'>
            {tool.compliance && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Compliance</h3>
                {tool.compliance.config && (
                  <div>
                    {tool.compliance.config.docs && (
                      <div className='mt-2'>
                        <h4 className='font-semibold'>Docs:</h4>
                        <a
                          href={tool.compliance.config.docs}
                          className='text-blue-500 hover:underline'
                        >
                          {tool.compliance.config.docs}
                        </a>
                      </div>
                    )}
                    {tool.compliance.config.instructions && (
                      <div className='mt-2'>
                        <h4 className='font-semibold'>Instructions:</h4>
                        <p>{tool.compliance.config.instructions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {tool.toolingListingNotes && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Tooling Listing Notes</h3>
                <p>{tool.toolingListingNotes}</p>
              </div>
            )}
            {tool.toolingTypes && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Tooling Types</h3>
                <ul className='list-disc list-inside'>
                  {tool.toolingTypes.map((type, index) => (
                    <li key={index}>{type}</li>
                  ))}
                </ul>
              </div>
            )}
            {tool.languages && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Languages</h3>
                <ul className='list-disc list-inside'>
                  {tool.languages.map((language, index) => (
                    <li key={index}>{language}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className='w-1/2 pl-4'>
            {tool.creators && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Creators</h3>
                <ul className='list-disc list-inside'>
                  {tool.creators.map((creator, index) => (
                    <li key={index}>
                      {creator.username} ({creator.platform})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.maintainers && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Maintainers</h3>
                <ul className='list-disc list-inside'>
                  {tool.maintainers.map((maintainer, index) => (
                    <li key={index}>
                      {maintainer.username} ({maintainer.platform})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.license && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>License</h3>
                <p>{tool.license}</p>
              </div>
            )}
            {tool.source && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Source</h3>
                <a href={tool.source} className='text-blue-500 hover:underline'>
                  {tool.source}
                </a>
              </div>
            )}
            {tool.homepage && (
              <div className='mt-4'>
                <h3 className='text-lg font-semibold'>Homepage</h3>
                <a
                  href={tool.homepage}
                  className='text-blue-500 hover:underline'
                >
                  {tool.homepage}
                </a>
              </div>
            )}
          </div>
        </div>
        <div className='mt-6'>
          {tool.supportedDialects && (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold'>Supported Dialects</h3>
              {tool.supportedDialects.draft && (
                <div className='mt-2'>
                  <h4 className='font-semibold'>Draft:</h4>
                  <ul className='list-disc list-inside'>
                    {tool.supportedDialects.draft.map((draft, index) => (
                      <li key={index}>{draft}</li>
                    ))}
                  </ul>
                </div>
              )}
              {tool.supportedDialects.additional && (
                <div className='mt-2'>
                  <h4 className='font-semibold'>Additional:</h4>
                  <ul className='list-disc list-inside'>
                    {tool.supportedDialects.additional.map(
                      (additional, index) => (
                        <li key={index}>
                          {additional.name} (
                          <a
                            href={additional.source}
                            className='text-blue-500 hover:underline'
                          >
                            Source
                          </a>
                          )
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
          {tool.bowtie && (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold'>Bowtie Identifier</h3>
              <p>{tool.bowtie.identifier}</p>
            </div>
          )}
          {tool.dependsOnValidators && (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold'>Depends On Validators</h3>
              <ul className='list-disc list-inside'>
                {tool.dependsOnValidators.map((validator, index) => (
                  <li key={index}>
                    <a
                      href={validator}
                      className='text-blue-500 hover:underline'
                    >
                      {validator}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tool.landscape && (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold'>Landscape</h3>
              {tool.landscape.logo && (
                <div className='mt-2'>
                  <h4 className='font-semibold'>Logo:</h4>
                  <p>{tool.landscape.logo}</p>
                </div>
              )}
              {tool.landscape.optOut !== undefined && (
                <div className='mt-2'>
                  <h4 className='font-semibold'>Opt-Out:</h4>
                  <p>{tool.landscape.optOut ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
