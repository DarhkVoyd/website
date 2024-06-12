import React, { useState } from 'react';
import fs from 'fs';
import Head from 'next/head';
import yaml from 'js-yaml';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { getLayout } from '~/components/SiteLayout';
import FilterSidebar from './FilterSidebar';
import MobileFilterButton from './MobileFilterButton';

export async function getStaticProps() {
  const toolingsData = yaml.load(
    fs.readFileSync('data/tooling-data.yaml', 'utf-8'),
  );

  return {
    props: {
      toolingsData,
    },
  };
}

interface ToolingData {
  name: string;
}

export default function ToolingPage({
  toolingsData,
}: {
  toolingsData: ToolingData[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <SectionContext.Provider value='tools'>
      <Head>
        <title>JSON Schema Tooling</title>
      </Head>
      <div className='max-w-[1400px] mx-auto flex flex-col items-center'>
        <section className='w-full'>
          <MobileFilterButton
            toolingNumber={toolingsData.length}
            setOpen={setOpen}
          />

          <div
            className={`z-[150] absolute top-10 mt-24 left-0 h-full w-screen bg-white dark:bg-slate-900 dark:shadow-lg transform ${open ? '-translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out filter drop-shadow-md `}
          >
            <div className='flex flex-col  dark:bg-slate-900'>
              <FilterSidebar open={open} setOpen={setOpen} />
            </div>
          </div>

          <div className='dark:bg-slate-800 max-w-[1400px] grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-12'>
            <div className='hidden lg:block mt-24'>
              <FilterSidebar open={open} setOpen={setOpen} />
            </div>
            <div className='col-span-4 md:col-span-3 lg:mt-20 lg:w-5/6 mx-4 md:mx-0'>
              <Headline1>JSON Schema Tooling</Headline1>
              {toolingsData.map((toolingData, idx) => {
                return <div key={idx}>{toolingData.name}</div>;
              })}
            </div>
          </div>
        </section>
      </div>
    </SectionContext.Provider>
  );
}

ToolingPage.getLayout = getLayout;
