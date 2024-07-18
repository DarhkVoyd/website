import { useMemo, useState, useEffect, useCallback } from 'react';
import { NextRouter, useRouter } from 'next/router';
import Fuse from 'fuse.js';

import { DRAFT_ORDER } from '~/lib/config';
import getQueryParamValues from '../lib/getQueryParamValues';
import { type JSONSchemaTool } from '../JSONSchemaTool';

export interface Preferences {
  query: string;
  groupBy: 'none' | 'toolingTypes' | 'languages' | 'environments';
  sortBy: 'name' | 'license';
  sortOrder: 'ascending' | 'descending';
  licenses: string[];
  languages: string[];
  drafts: `${(typeof DRAFT_ORDER)[number]}`[];
  toolingTypes: string[];
}

export interface GroupedTools {
  [group: string]: JSONSchemaTool[];
}

const getInitialPreferences = (searchParams: URLSearchParams): Preferences => ({
  query: (searchParams.get('query') as Preferences['query']) || '',
  groupBy:
    (searchParams.get('groupBy') as Preferences['groupBy']) || 'toolingTypes',
  sortBy: (searchParams.get('sortBy') as Preferences['sortBy']) || 'name',
  sortOrder:
    (searchParams.get('sortOrder') as Preferences['sortOrder']) || 'ascending',
  languages: getQueryParamValues(searchParams.getAll('languages')),
  licenses: getQueryParamValues(searchParams.getAll('license')),
  drafts: getQueryParamValues(
    searchParams.getAll('drafts'),
  ) as Preferences['drafts'],
  toolingTypes: getQueryParamValues(searchParams.getAll('toolingTypes')),
});

const updateURLParams = (preferences: Preferences, router: NextRouter) => {
  const params = new URLSearchParams();
  Object.entries(preferences).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => params.append(key, val));
    } else {
      params.set(key, value);
    }
  });
  router.replace({ query: params.toString() }, undefined, { shallow: true });
};

const filterTools = (
  tools: JSONSchemaTool[],
  preferences: Preferences,
): JSONSchemaTool[] => {
  const lowerCaseArray = (arr: string[]) =>
    arr.map((item) => item.toLowerCase());
  const lowerCasePreferences = {
    languages: lowerCaseArray(preferences.languages),
    licenses: lowerCaseArray(preferences.licenses),
    toolingTypes: lowerCaseArray(preferences.toolingTypes),
    drafts: preferences.drafts.map(String),
  };

  return tools.filter((tool) => {
    const matchesLanguage =
      lowerCasePreferences.languages.length === 0 ||
      (tool.languages || []).some((lang) =>
        lowerCasePreferences.languages.includes(lang.toLowerCase()),
      );

    const matchesLicense =
      lowerCasePreferences.licenses.length === 0 ||
      (tool.license &&
        lowerCasePreferences.licenses.includes(tool.license.toLowerCase()));

    const matchesToolingType =
      lowerCasePreferences.toolingTypes.length === 0 ||
      (tool.toolingTypes || []).some((type) =>
        lowerCasePreferences.toolingTypes.includes(type.toLowerCase()),
      );

    const matchesDraft =
      lowerCasePreferences.drafts.length === 0 ||
      (tool.supportedDialects?.draft || []).some((draft) =>
        lowerCasePreferences.drafts.includes(String(draft)),
      );

    return (
      matchesLanguage && matchesLicense && matchesToolingType && matchesDraft
    );
  });
};

const sortTools = (
  tools: JSONSchemaTool[],
  preferences: Preferences,
): JSONSchemaTool[] => {
  const compare = (a: JSONSchemaTool, b: JSONSchemaTool) => {
    const aValue =
      preferences.sortBy === 'name'
        ? a.name.toLowerCase()
        : (a.license || '').toLowerCase();
    const bValue =
      preferences.sortBy === 'name'
        ? b.name.toLowerCase()
        : (b.license || '').toLowerCase();
    return preferences.sortOrder === 'ascending'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  };
  return [...tools].sort(compare);
};

const groupTools = (
  tools: JSONSchemaTool[],
  groupBy: Preferences['groupBy'],
): [GroupedTools, numberOfTools: number] => {
  const groupedTools: GroupedTools = {};
  let numberOfTools = 0;

  if (groupBy === 'none') {
    groupedTools['none'] = tools;
    return [groupedTools, tools.length];
  }

  tools.forEach((tool) => {
    const groups = tool[groupBy] || [];
    if (groups.length > 0) {
      groups.forEach((group) => {
        if (!groupedTools[group]) groupedTools[group] = [];
        groupedTools[group].push(tool);
      });
      numberOfTools++;
    }
  });

  const sortedGroupedTools = Object.keys(groupedTools)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .reduce((acc, key) => {
      acc[key] = groupedTools[key];
      return acc;
    }, {} as GroupedTools);

  return [sortedGroupedTools, numberOfTools];
};

export default function usePreferences(tools: JSONSchemaTool[]) {
  const router = useRouter();
  const { asPath } = router;
  const searchParams = new URLSearchParams(asPath.split('?')[1]);
  const initialPreferences = getInitialPreferences(searchParams);

  const [preferences, setPreferences] =
    useState<Preferences>(initialPreferences);

  useEffect(() => {
    updateURLParams(preferences, router);
  }, [preferences]);

  const resetPreferences = useCallback(() => {
    setPreferences((prev) => ({
      query: '',
      groupBy: prev.groupBy,
      sortBy: 'name',
      sortOrder: 'ascending',
      languages: [],
      licenses: [],
      drafts: [],
      toolingTypes: [],
    }));
    window.scrollTo(0, 0);
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(tools, { keys: ['name'], includeScore: true, threshold: 0.3 }),
    [tools],
  );
  const hits = useMemo(
    () =>
      preferences.query.trim() === ''
        ? tools
        : fuse.search(preferences.query).map((result) => result.item),
    [fuse, preferences.query, tools],
  );
  const filteredHits = useMemo(
    () => filterTools(hits, preferences),
    [
      hits,
      preferences.languages,
      preferences.drafts,
      preferences.toolingTypes,
      preferences.licenses,
    ],
  );
  const sortedHits = useMemo(
    () => sortTools(filteredHits, preferences),
    [filteredHits, preferences.sortBy, preferences.sortOrder],
  );
  const [groupedTools, numberOfTools] = useMemo(
    () => groupTools(sortedHits, preferences.groupBy),
    [sortedHits, preferences.groupBy],
  );

  return {
    preferredTools: groupedTools,
    numberOfTools,
    preferences,
    setPreferences,
    resetPreferences,
  };
}
