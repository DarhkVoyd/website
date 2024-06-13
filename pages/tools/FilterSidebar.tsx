import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { SegmentHeadline } from '../../components/Layout';
import classnames from 'classnames';
import FilterCheckbox from './FilterCheckbox';
import extractPathWithoutFragment from '~/lib/extractPathWithoutFragment';

const getDocsPath = [
  '/overview/what-is-jsonschema',
  '/overview/sponsors',
  '/overview/similar-technologies',
  '/overview/code-of-conduct',
];

export default function FilterSidebar() {
  const router = useRouter();

  /* eslint-disable no-constant-condition */
  const [active, setActive] = useState({
    getDocs: false,
  });
  useEffect(() => {
    const pathWtihoutFragment = extractPathWithoutFragment(router.asPath);
    if (getDocsPath.includes(pathWtihoutFragment)) {
      setActive({ ...active, getDocs: true });
    }
  }, [router.asPath]);

  const handleClickDoc = () => {
    setActive({ ...active, getDocs: !active.getDocs });
  };

  const rotate = active.getDocs ? 'rotate(180deg)' : 'rotate(0)';

  const { theme } = useTheme();

  const [overview_icon, setOverview_icon] = useState('');

  useEffect(() => {
    if (theme === 'dark') {
      setOverview_icon('/icons/eye-dark.svg');
    } else {
      setOverview_icon('/icons/eye.svg');
    }
  }, [theme]);

  return (
    <div id='sidebar' className='lg:mt-8 w-4/5 mx-auto lg:ml-4'>
      <div className='my-2 bg-slate-200 dark:bg-slate-900 border-white border lg:border-hidden p-2 rounded'>
        <div
          className='flex justify-between w-full items-center'
          onClick={handleClickDoc}
        >
          <div className='flex  items-center align-middle'>
            <img src={`${overview_icon}`} alt='eye icon' className='mr-2' />
            <SegmentHeadline label='Filters' />
          </div>
          <svg
            style={{
              transform: rotate,
              transition: 'all 0.2s linear',
              cursor: 'pointer',
            }}
            id='arrow'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            height='32'
            viewBox='0 0 24 24'
            width='24'
          >
            <path
              clipRule='evenodd'
              d='m16.5303 8.96967c.2929.29289.2929.76777 0 1.06063l-4 4c-.2929.2929-.7677.2929-1.0606 0l-4.00003-4c-.29289-.29286-.29289-.76774 0-1.06063s.76777-.29289 1.06066 0l3.46967 3.46963 3.4697-3.46963c.2929-.29289.7677-.29289 1.0606 0z'
              fill='#707070'
              fillRule='evenodd'
            />
          </svg>
        </div>
        <div
          className={classnames('ml-6', { hidden: !active.getDocs })}
          id='overview'
        >
          <FilterCheckbox
            uri='/overview/what-is-jsonschema'
            label='What is JSON Schema?'
          />
        </div>
      </div>
    </div>
  );
}
