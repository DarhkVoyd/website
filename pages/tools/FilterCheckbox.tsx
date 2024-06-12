import React from 'react';
import { useRouter } from 'next/router';
import { HOST } from '~/lib/config';
import Link from 'next/link';
import extractPathWithoutFragment from '~/lib/extractPathWithoutFragment';
import classnames from 'classnames';

export default function FilterCheckbox({
  uri,
  label,
  onClick,
  setOpen,
}: {
  uri: string;
  label: string | React.ReactNode;
  onClick?: () => void;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const url = new URL(`${router.asPath}`, HOST);
  url.search = '';
  url.hash = '';
  const stringUrl = url.toString().substr(HOST.length, Infinity);
  const isActive = uri === extractPathWithoutFragment(stringUrl);
  return (
    <Link
      href={uri}
      className={classnames('text-sm block py-1 pl-2 font-medium')}
      onClick={() => {
        if (onClick) onClick();
        setOpen(false);
      }}
    >
      {label}
    </Link>
  );
}
