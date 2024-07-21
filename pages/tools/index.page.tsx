import React, { useState } from 'react';
import fs from 'fs';
import Head from 'next/head';
import yaml from 'js-yaml';

import { SectionContext } from '~/context';
import { getLayout } from '~/components/SiteLayout';
import { DRAFT_ORDER } from '~/lib/config';
import { Headline1 } from '~/components/Headlines';

import Sidebar from './components/Sidebar';
import ToolingTable from './components/ToolingTable/ToolingTable';
import GroupBySelector from './components/GroupBySelector';
import usePreferences from './hooks/usePreferences';

import { type JSONSchemaTool } from './JSONSchemaTool';
import getUniqueValuesPerField, {
  UniqueValuesPerField,
} from './lib/getUniqueValuesPerField';
import Link from 'next/link';

export async function getStaticProps() {
  const toolingData = yaml.load(
    fs.readFileSync('data/tooling-data.yaml', 'utf-8'),
  ) as JSONSchemaTool[];

  const uniqueValuesPerField = {
    languages: getUniqueValuesPerField(toolingData, '$..languages[*]'),
    drafts: getUniqueValuesPerField(
      toolingData,
      '$..supportedDialects.draft[*]',
      [1, 2, 3],
    ),
    toolingTypes: getUniqueValuesPerField(toolingData, '$..toolingTypes[*]'),
    licenses: getUniqueValuesPerField(toolingData, '$..license'),
  };

  uniqueValuesPerField.drafts?.sort((a, b) => {
    const aIndex = DRAFT_ORDER.map(String).indexOf(a);
    const bIndex = DRAFT_ORDER.map(String).indexOf(b);

    if (aIndex === -1 && bIndex === -1) {
      return 0;
    } else if (aIndex === -1) {
      return 1;
    } else if (bIndex === -1) {
      return -1;
    }

    return aIndex - bIndex;
  });

  return {
    props: {
      toolingData,
      uniqueValuesPerField,
    },
  };
}

export default function ToolingPage({
  toolingData,
  uniqueValuesPerField,
}: {
  toolingData: JSONSchemaTool[];
  uniqueValuesPerField: UniqueValuesPerField;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    preferredTools,
    numberOfTools,
    preferences,
    setPreferences,
    resetPreferences,
  } = usePreferences(toolingData);

  return (
    <SectionContext.Provider value='tools'>
      <Head>
        <title>JSON Schema - Tools</title>
      </Head>
      <div className='mx-auto w-full max-w-[1400px] min-h-screen flex flex-col items-center'>
        <div
          className='bg-primary w-full h-12 mt-[4.5rem] relative lg:hidden px-8 flex justify-between items-center'
          onClick={() => {
            setIsSidebarOpen((prev) => !prev);
          }}
        >
          <h3 className='text-white'>{numberOfTools} Tools</h3>

          <svg
            style={{
              transform: `${isSidebarOpen ? 'rotate(180deg)' : 'rotate(0)'}`,
              transition: 'transform 0.2s linear',
            }}
            xmlns='http://www.w3.org/2000/svg'
            height='24'
            viewBox='0 0 256 512'
          >
            <path
              d='M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z'
              fill='#ffffff'
            />
          </svg>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-12 min-h-screen'>
          <div
            className={`absolute lg:static top-10 lg:top-auto left-0 lg:left-auto mt-24 w-screen lg:w-auto h-full lg:h-auto bg-white dark:bg-slate-800 lg:bg-transparent transition-transform lg:transform-none duration-300 lg:duration-0 ease-in-out overflow-y-auto ${isSidebarOpen ? '-translate-x-0' : '-translate-x-full'} z-5`}
            style={{ height: 'calc(100% - 8rem)' }}
          >
            <div className='hidden lg:block'>
              <h1 className='text-h1mobile md:text-h1 font-bold lg:ml-4 lg:mt-6'>
                {numberOfTools}
              </h1>
              <div className='text-xl text-slate-900 dark:text-slate-300 font-bold lg:ml-6'>
                Tools
              </div>
            </div>
            <Sidebar
              uniqueValuesPerField={uniqueValuesPerField}
              preferences={preferences}
              setPreferences={setPreferences}
              resetPreferences={resetPreferences}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>

          <main
            className={`md:col-span-3 lg:mt-20 lg:w-full mx-4 md:mx-0 ${isSidebarOpen ? 'hidden lg:block' : ''}`}
          >
            <Headline1>JSON Schema Tooling</Headline1>
            <p className='text-slate-600 block leading-7 pb-4 dark:text-slate-300'>
              Toolings below are written in different languages, and support
              part, or all, of at least one recent version of the specification.
            </p>
            <p className='text-slate-600 block leading-7 pb-4 dark:text-slate-300'>
              Listing does not signify a recommendation or endorsement of any
              kind.
            </p>
            <div className='flex flex-row items-center gap-2 w-full'>
              <div className='flex items-center justify-center gap-2 w-1/2'>
                <Link
                  className='flex-none max-w-full'
                  href='https://github.com/json-schema-org/website/issues/'
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    src='/img/tools/adding_your_tool.png'
                    className='rounded-sm h-[76px]'
                  />
                </Link>
                <p className='hidden lg:block text-slate-600 dark:text-slate-300'>
                  Raise an issue and we'll add your tool to the data we use to
                  build this website
                </p>
              </div>

              <div className='flex items-center justify-center gap-2 w-1/2'>
                <Link
                  className='flex-none max-w-full'
                  href='https://bowtie.report'
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    src='/img/tools/try_bowtie.png'
                    className='rounded-sm h-[76px]'
                  />
                </Link>
                <p className='hidden lg:block text-slate-600 dark:text-slate-300'>
                  Bowtie is a meta-validator for JSON Schema, coordinating and
                  reporting results from other validators.
                </p>
              </div>
            </div>
            <GroupBySelector
              preferences={preferences}
              setPreferences={setPreferences}
            />
            <ToolingTable
              groupedTools={preferredTools}
              preferences={preferences}
              setPreferences={setPreferences}
            />
          </main>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

ToolingPage.getLayout = getLayout;
