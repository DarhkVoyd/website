import React, { useState } from 'react';
import fs from 'fs';
import Head from 'next/head';
import yaml from 'js-yaml';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { getLayout } from '~/components/SiteLayout';
import FilterSidebar from './FilterSidebar';
import MobileSidebarButton from './MobileSidebarButton';
import ToolingTable from './ToolingTable';

export async function getStaticProps() {
  const toolingData = yaml.load(
    fs.readFileSync('data/tooling-data.yaml', 'utf-8'),
  );

  return {
    props: {
      toolingData,
    },
  };
}

export interface Tooling {
  name: string;
  description: string;
  toolingType: string[];
  languages: string[];
  license: string;
  repositoryURL: string;
  supportedDialects: {
    draft: number[];
  };
  lastUpdated: string;
}

export default function ToolingPage({
  toolingData,
}: {
  toolingData: Tooling[];
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SectionContext.Provider value='tools'>
      <Head>
        <title>JSON Schema - Tools</title>
      </Head>
      <div className='max-w-[1400px] mx-auto flex flex-col items-center'>
        <section className='w-full'>
          <MobileSidebarButton
            toolingNumber={toolingData.length}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          <div
            className={`z-[150] absolute top-10 mt-24 left-0 h-full w-screen bg-white dark:bg-slate-900 dark:shadow-lg transform ${isSidebarOpen ? '-translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out filter drop-shadow-md `}
          >
            <div className='flex flex-col  dark:bg-slate-900'>
              <FilterSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>
          </div>

          <div className='dark:bg-slate-800 max-w-[1400px] grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-12'>
            <div className='hidden lg:block mt-24'>
              <FilterSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>
            <div className='col-span-4 md:col-span-3 lg:mt-20 lg:w-5/6 mx-4 md:mx-0'>
              <Headline1>JSON Schema Tooling</Headline1>
              <ToolingTable items={toolingData} />
            </div>
          </div>
        </section>
      </div>
    </SectionContext.Provider>
  );
}

ToolingPage.getLayout = getLayout;
