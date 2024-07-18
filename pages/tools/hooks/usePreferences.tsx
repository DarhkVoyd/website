import Fuse from 'fuse.js';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DRAFT_ORDER } from '~/lib/config';
import { type JSONSchemaTool } from '../JSONSchemaTool';
import getQueryParamValues from '../lib/getQueryParamValues';

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

export default function usePreferences(tools: JSONSchemaTool[]) {
  const router = useRouter();
  const { asPath } = router;
  const searchParams = new URLSearchParams(asPath.split('?')[1]);

  const initialPreferences: Preferences = {
    query: (searchParams.get('query') as Preferences['query']) || '',
    groupBy:
      (searchParams.get('groupBy') as Preferences['groupBy']) || 'toolingTypes',
    sortBy: (searchParams.get('sortBy') as Preferences['sortBy']) || 'name',
    sortOrder:
      (searchParams.get('sortOrder') as Preferences['sortOrder']) ||
      'ascending',
    languages: getQueryParamValues(searchParams.getAll('languages')),
    licenses: getQueryParamValues(searchParams.getAll('license')),
    drafts: getQueryParamValues(
      searchParams.getAll('drafts'),
    ) as Preferences['drafts'],
    toolingTypes: getQueryParamValues(searchParams.getAll('toolingTypes')),
  };

  const [preferences, setPreferences] =
    useState<Preferences>(initialPreferences);

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(preferences).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((val) => params.append(key, val));
        } else {
          params.set(key, value);
        }
      }
    });

    router.replace({ query: params.toString() }, undefined, { shallow: true });
  }, [preferences]);

  const resetPreferences = () => {
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
  };

  const fuse = useMemo(() => {
    return new Fuse(tools, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.3,
    });
  }, [tools]);

  const hits = useMemo(() => {
    if (preferences.query.trim() === '') {
      return tools;
    } else {
      return fuse.search(preferences.query).map((result) => result.item);
    }
  }, [fuse, preferences.query, tools]);

  const filteredHits = useMemo(() => {
    if (
      !preferences.languages &&
      !preferences.licenses &&
      !preferences.drafts
    ) {
      return hits;
    }

    return hits.filter((tool: JSONSchemaTool) => {
      if (preferences.languages && preferences.languages.length > 0) {
        if (
          !tool.languages ||
          !preferences.languages.some((lang) =>
            tool.languages?.some((l) => l.toLowerCase() === lang.toLowerCase()),
          )
        ) {
          return false;
        }
      }

      if (preferences.licenses && preferences.licenses.length > 0) {
        if (
          !tool.license ||
          !preferences.licenses.some(
            (license) => license.toLowerCase() === tool.license?.toLowerCase(),
          )
        ) {
          return false;
        }
      }

      if (preferences.toolingTypes && preferences.toolingTypes.length > 0) {
        if (
          !tool.toolingTypes ||
          !preferences.toolingTypes.some((toolingType) =>
            tool.toolingTypes?.some(
              (t) => t.toLowerCase() === toolingType.toLowerCase(),
            ),
          )
        ) {
          return false;
        }
      }

      if (preferences.drafts && preferences.drafts.length > 0) {
        if (!tool.supportedDialects || !tool.supportedDialects.draft) {
          return false;
        }
        const toolDrafts = tool.supportedDialects.draft.map(String);

        if (!preferences.drafts.some((draft) => toolDrafts.includes(draft))) {
          return false;
        }
      }

      return true;
    });
  }, [hits, preferences.languages, preferences.licenses, preferences.drafts]);

  const sortedHits = useMemo(() => {
    const compare = (a: JSONSchemaTool, b: JSONSchemaTool) => {
      let aValue, bValue;

      switch (preferences.sortBy) {
        case 'name':
          bValue = b.name.toLowerCase();
          aValue = a.name.toLowerCase();
          break;
        case 'license':
          aValue = a.license ? a.license.toLowerCase() : '';
          bValue = b.license ? b.license.toLowerCase() : '';
          break;
        default:
          return 0;
      }

      if (preferences.sortOrder === 'ascending') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else if (preferences.sortOrder === 'descending') {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      }
      return 0;
    };

    return [...filteredHits].sort(compare);
  }, [filteredHits, preferences.sortBy, preferences.sortOrder]);

  const [groupedTools, numberOfTools] = useMemo(() => {
    const groupedTools: GroupedTools = {};
    let numberOfTools = 0;

    if (
      preferences.groupBy === 'toolingTypes' ||
      preferences.groupBy === 'languages' ||
      preferences.groupBy === 'environments'
    ) {
      sortedHits.forEach((tool) => {
        const groupBy = preferences.groupBy as
          | 'toolingTypes'
          | 'languages'
          | 'environments';
        const groups = tool[groupBy];
        if (groups !== undefined) {
          groups.forEach((group) => {
            if (!groupedTools[group]) {
              groupedTools[group] = [];
            }
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
    } else {
      groupedTools['none'] = sortedHits;
      numberOfTools = sortedHits.length;
    }
    return [groupedTools, numberOfTools];
  }, [sortedHits, preferences.groupBy]);

  return {
    preferredTools: groupedTools,
    numberOfTools,
    preferences,
    setPreferences,
    resetPreferences,
  };
}
