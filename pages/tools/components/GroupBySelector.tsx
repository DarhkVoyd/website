import React, { Dispatch, SetStateAction } from 'react';
import { Preferences } from '../lib/usePreferences';
import convertToTitleCase from '../lib/convertToTitleCase';

export default function GroupSelector({
  preferences,
  setPreferences,
}: {
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
}) {
  const groupBy = preferences.groupBy;
  const setGroupPreference = (event: React.MouseEvent) => {
    setPreferences((prev) => ({
      ...prev,
      groupBy: (event.target as HTMLButtonElement).value as typeof groupBy,
    }));
  };

  const groups: Record<string, Preferences['groupBy']> = {
    None: 'none',
    'Tooling Types': 'toolingTypes',
    Languages: 'languages',
    Environments: 'environments',
    'Supported Dialects': 'supportedDialects.draft',
  };

  return (
    <div className='ml-2 my-8 flex items-center space-x-2'>
      <span className='text-slate-600'>GROUP BY:</span>
      {Object.keys(groups).map((group) => {
        return (
          <button
            key={group}
            value={groups[group]}
            onClick={setGroupPreference}
            className={`px-4 py-2 border rounded ${preferences.groupBy === groups[group] ? 'bg-primary text-white' : 'bg-white text-slate-600'}`}
          >
            {convertToTitleCase(group!)}
          </button>
        );
      })}
    </div>
  );
}
