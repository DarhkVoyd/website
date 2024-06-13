import React, { useState } from 'react';
import fs from 'fs';
import Head from 'next/head';
import yaml from 'js-yaml';
import { Headline1 } from '~/components/Headlines';
import { SectionContext } from '~/context';
import { getLayout } from '~/components/SiteLayout';
import FilterSidebar from './FilterSidebar';
import MobileToggleSidebarButton from './MobileToggleSidebarButton';
import ToolingTable from './ToolingTable';
import classnames from 'classnames';
import StyledMarkdown from '~/components/StyledMarkdown';
import matter from 'gray-matter';

export async function getStaticProps() {
  const toolingData = yaml.load(
    fs.readFileSync('data/tooling-data.yaml', 'utf-8'),
  );
  const intro = fs.readFileSync('pages/tools/content/intro.md', 'utf-8');
  const { content: introContent } = matter(intro);

  return {
    props: {
      toolingData,
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
  supportedDialects: {
    draft: number[];
  };
  lastUpdated: string;
}

export default function ToolingPage({
  toolingData,
  content,
}: {
  toolingData: Tooling[];
  content: Record<string, string>;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SectionContext.Provider value='tools'>
      <Head>
        <title>JSON Schema - Tools</title>
      </Head>
      <div className='max-w-[1400px] mx-auto flex flex-col items-center'>
        <main className='w-full'>
          <MobileToggleSidebarButton
            toolingNumber={toolingData.length}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          <div className='grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-12'>
            <div className={classnames('lg:mt-24')}>
              <FilterSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>
            <div className='md:col-span-3 lg:mt-20 lg:w-5/6 mx-4 md:mx-0'>
              <Headline1>JSON Schema Tooling</Headline1>
              <StyledMarkdown markdown={content.intro} />
              <ToolingTable items={toolingData} />
            </div>
          </div>
        </main>
      </div>
    </SectionContext.Provider>
  );
}

ToolingPage.getLayout = getLayout;
