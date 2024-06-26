import Fuse from 'fuse.js';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { type Tooling } from './JSONSchemaTool';

export interface Preferences {
  query: string;
  groupBy:
    | 'none'
    | 'toolingTypes'
    | 'languages'
    | 'environments'
    | 'supportedDialects.draft';
  sortBy: 'none' | 'name.asc' | 'name.des' | 'license.asc' | 'license.des';
  license: string[];
  languages: string[];
  'supportedDialects.draft': string[];
}

export interface GroupedTools {
  [group: string]: Tooling[];
}

function getQueryParamValues(param: string | string[] | undefined): string[] {
  if (!param) return [];

  if (typeof param === 'string') {
    return [decodeURIComponent(param)];
  } else {
    return param.map((p) => decodeURIComponent(p));
  }
}

const getFieldValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export default function usePreferences(tools: Tooling[]) {
  const router = useRouter();
  const { asPath } = router;
  const searchParams = new URLSearchParams(asPath.split('?')[1]);

  const initialPreferences: Preferences = {
    query: (searchParams.get('query') as Preferences['query']) || '',
    groupBy:
      (searchParams.get('groupBy') as Preferences['groupBy']) || 'toolingTypes',
    sortBy: (searchParams.get('sortBy') as Preferences['sortBy']) || 'none',
    languages: getQueryParamValues(searchParams.getAll('languages')),
    license: getQueryParamValues(searchParams.getAll('license')),
    'supportedDialects.draft': getQueryParamValues(
      searchParams.getAll('supportedDialects.draft'),
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
    setPreferences((prev) => ({
      query: '',
      groupBy: prev.groupBy,
      sortBy: 'none',
      languages: [],
      license: [],
      'supportedDialects.draft': [],
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
            tool?.languages?.some(
              (l) => l.toLowerCase() === lang.toLowerCase(),
            ),
          )
        ) {
          return false;
        }
      }

      if (preferences.license && preferences.license.length > 0) {
        if (
          !tool.license ||
          !preferences.license.some(
            (license) => license.toLowerCase() === tool?.license?.toLowerCase(),
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
        case 'name.asc':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'name.des':
          bValue = a.name.toLowerCase();
          aValue = b.name.toLowerCase();
          break;
        case 'license.asc':
          aValue = a.license ? a.license.toLowerCase() : '';
          bValue = b.license ? b.license.toLowerCase() : '';
          break;
        case 'license.des':
          bValue = a.license ? a.license.toLowerCase() : '';
          aValue = b.license ? b.license.toLowerCase() : '';
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

  const [groupedTools, numberOfTools] = useMemo(() => {
    const groupedTools: GroupedTools = {};
    let numberOfTools = 0;
    const disabledViews = [
      'description',
      'source',
      'homepage',
      'toolingListingNotes',
      'bowtie.identifier',
      'compliance.config.docs',
      'compliance.config.instructions',
      'landspace.logo',
    ];

    if (preferences.groupBy === 'none') {
      groupedTools['none'] = sortedHits;
      numberOfTools = sortedHits.length;
    } else {
      sortedHits.forEach((tool) => {
        const groups = getFieldValue(tool, preferences.groupBy);
        let groupLabelBase = '';

        const groupByParts = preferences.groupBy.split('.');
        if (groupByParts.length > 1) {
          groupLabelBase = `${groupByParts.pop()}: `;
        }

        if (
          groups !== undefined &&
          !disabledViews.includes(preferences.groupBy)
        ) {
          if (Array.isArray(groups)) {
            (groups as string[]).forEach((group) => {
              const groupLabel = groupLabelBase + group;
              if (!groupedTools[groupLabel]) {
                groupedTools[groupLabel] = [];
              }
              groupedTools[groupLabel].push(tool);
            });
          } else if (typeof groups === 'string') {
            const stringValue = String(groups);
            if (!groupedTools[stringValue]) {
              groupedTools[stringValue] = [];
            }
            groupedTools[stringValue].push(tool);
          }
          numberOfTools++;
        }
      });
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
