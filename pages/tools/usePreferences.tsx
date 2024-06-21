import Fuse from 'fuse.js';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { type Tooling } from './index.page';

export interface Preferences {
  query: string;
  viewBy: 'all' | 'toolingTypes' | 'languages';
  sortBy: 'none' | 'name' | 'license';
  license: string[] | null;
  languages: string[] | null;
  'supportedDialects.draft': string[] | null;
}

function getQueryParamValues(
  param: string | string[] | undefined,
): string[] | null {
  if (!param) return null;

  if (typeof param === 'string') {
    return [decodeURIComponent(param)];
  } else {
    return param.map((p) => decodeURIComponent(p));
  }
}

export default function usePreferences(tools: Tooling[]) {
  const router = useRouter();
  const { asPath } = router;
  const urlParams = new URLSearchParams(asPath.split('?')[1]);

  const initialPreferences: Preferences = {
    query: (urlParams.get('query') as Preferences['query']) || '',
    viewBy:
      (urlParams.get('viewBy') as Preferences['viewBy']) || 'toolingTypes',
    sortBy: (urlParams.get('sortBy') as Preferences['sortBy']) || 'none',
    languages: getQueryParamValues(urlParams.getAll('languages')),
    license: getQueryParamValues(urlParams.getAll('license')),
    'supportedDialects.draft': getQueryParamValues(
      urlParams.getAll('supportedDialects.draft'),
    ),
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
    setPreferences({
      query: '',
      viewBy: 'toolingTypes',
      sortBy: 'none',
      languages: null,
      license: null,
      'supportedDialects.draft': null,
    });
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
      !preferences.license &&
      !preferences['supportedDialects.draft']
    ) {
      return hits;
    }

    return hits.filter((tool: Tooling) => {
      if (preferences.languages && preferences.languages.length > 0) {
        if (
          !tool.languages ||
          !preferences.languages.some((lang) =>
            tool.languages.some((l) => l.toLowerCase() === lang.toLowerCase()),
          )
        ) {
          return false;
        }
      }

      if (preferences.license && preferences.license.length > 0) {
        if (
          !tool.license ||
          !preferences.license.some(
            (license) => license.toLowerCase() === tool.license.toLowerCase(),
          )
        ) {
          return false;
        }
      }

      if (
        preferences['supportedDialects.draft'] &&
        preferences['supportedDialects.draft'].length > 0
      ) {
        if (!tool.supportedDialects || !tool.supportedDialects.draft) {
          return false;
        }
        const toolDrafts = tool.supportedDialects.draft.map(String);

        if (
          !preferences['supportedDialects.draft'].some((draft) =>
            toolDrafts.includes(draft),
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    hits,
    preferences.languages,
    preferences.license,
    preferences['supportedDialects.draft'],
  ]);

  const sortedHits = useMemo(() => {
    if (preferences.sortBy === 'none') {
      return filteredHits;
    }

    const compare = (a: Tooling, b: Tooling) => {
      let aValue, bValue;

      switch (preferences.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'license':
          aValue = a.license ? a.license.toLowerCase() : '';
          bValue = b.license ? b.license.toLowerCase() : '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    };

    return [...filteredHits].sort(compare);
  }, [filteredHits, preferences.sortBy]);

  const preferredData = useMemo(() => {
    const data = {};

    if (preferences.viewBy === 'all') {
      data['all'] = sortedHits;
    } else {
      sortedHits.forEach((tool) => {
        if (Array.isArray(tool[preferences.viewBy])) {
          tool[preferences.viewBy].forEach((category) => {
            if (!data[category]) {
              data[category] = [];
            }
            data[category].push(tool);
          });
        }
      });
    }

    return data;
  }, [sortedHits, preferences.viewBy]);
  return {
    preferredData,
    numberOfEntries: filteredHits.length,
    preferences,
    setPreferences,
    resetPreferences,
  };
}