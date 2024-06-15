import React, { useState } from 'react';
import fs from 'fs';
import Head from 'next/head';
import yaml from 'js-yaml';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { getLayout } from '~/components/SiteLayout';
import Sidebar from './sidebar/';
import ToolingTable from './ToolingTable';
import StyledMarkdown from '~/components/StyledMarkdown';
import matter from 'gray-matter';
import { DRAFT_ORDER } from '~/lib/config';
import collectDataDomains, { type DataDomains } from './collectDataDomains';

export async function getStaticProps() {
  const toolingData = yaml.load(
    fs.readFileSync('data/tooling-data.yaml', 'utf-8'),
  ) as Tooling[];
  const intro = fs.readFileSync('pages/tools/content/intro.md', 'utf-8');
  const { content: introContent } = matter(intro);

  const supportedDialectDrafts = DRAFT_ORDER.map(String);
  const dataDomains = collectDataDomains(
    toolingData,
    'languages',
    'license',
  ) as DataDomains;
  dataDomains.drafts = supportedDialectDrafts as Array<string>;

  return {
    props: {
      toolingData,
      dataDomains,
      content: {
        intro: introContent,
      },
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
  homepageURL: string;
  supportedDialects: {
    draft: string[];
  };
  lastUpdated: string;
}

export default function ToolingPage({
  toolingData,
  dataDomains,
  content,
}: {
  toolingData: Tooling[];
  dataDomains: DataDomains;
  content: Record<string, string>;
}) {
  const [filteredToolingData, setFilteredToolingData] =
    useState<Tooling[]>(toolingData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categoriseBy, setCategoriseBy] =
    useState<keyof Tooling>('toolingType');
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
          <h3 className='text-white'>{toolingData.length} Tools</h3>

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

        <div className='grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-12'>
          <div
            className={`absolute lg:static top-10 lg:top-auto left-0 lg:left-auto mt-24 w-screen lg:w-auto h-full lg:h-auto bg-white lg:bg-transparent transition-transform lg:transform-none duration-300 lg:duration-0 ease-in-out ${isSidebarOpen ? '-translate-x-0' : '-translate-x-full'} z-50`}
          >
            <div className='hidden lg:block'>
              <h1 className='text-h1mobile md:text-h1 font-bold lg:ml-4 lg:mt-6'>
                {toolingData.length.toString()}
              </h1>
              <div className='text-xl text-slate-900 font-bold lg:ml-6'>
                Tools
              </div>
            </div>
            <Sidebar
              dataDomains={dataDomains}
              toolingData={toolingData}
              setFilteredToolingData={setFilteredToolingData}
              categoriseBy={categoriseBy}
              setCategoriseBy={setCategoriseBy}
            />
          </div>
          <main className='md:col-span-3 lg:mt-20 lg:w-5/6 mx-4 md:mx-0'>
            <Headline1>JSON Schema Tooling</Headline1>
            <StyledMarkdown markdown={content.intro} />
            <div className='w-full grid grid-cols-1 lg:grid-cols-2'>
              <div>
                Raise an issue and we'll add your tool to the data we use to
                build this website
              </div>
              <div>
                Bowtie is a meta-validator for JSON Schema, coordinating and
                reporting results from other validators.
              </div>
            </div>
            <ToolingTable
              tools={filteredToolingData}
              categoriseBy={categoriseBy}
            />
          </main>
        </div>
      </div>
    </SectionContext.Provider>
  );
}

ToolingPage.getLayout = getLayout;
