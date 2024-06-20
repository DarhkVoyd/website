import { type Tooling } from './index.page';

export type Fields = 'license' | 'languages' | 'supportedDialects.draft';

export interface Exclusions {
  [key: string]: Set<string>;
}

const getFieldValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const setFieldValue = (obj: any, path: string, value: any): void => {
  const parts = path.split('.');
  const last = parts.pop()!;
  const target = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {};
    return acc[part];
  }, obj);
  target[last] = value;
};

const getUniqueValuesPerField = (
  data: Tooling[],
  fields: Fields[],
  exclusions: Exclusions = {},
) => {
  const uniqueValuesPerField: { [key: string]: Set<string> } = {};

  fields.forEach((field) => {
    uniqueValuesPerField[field] = new Set<string>();
  });

  data.forEach((item) => {
    fields.forEach((field) => {
      const value = getFieldValue(item, field);
      const excludeSet = exclusions[field] || new Set<string>();

      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.flat().forEach((element) => {
            const stringElement = String(element);
            if (!excludeSet.has(stringElement)) {
              uniqueValuesPerField[field].add(stringElement);
            }
          });
        } else {
          const stringValue = String(value);
          if (!excludeSet.has(stringValue)) {
            uniqueValuesPerField[field].add(stringValue);
          }
        }
      }
    });
  });

  const result: any = {};
  fields.forEach((field) => {
    const sortedArray = Array.from(uniqueValuesPerField[field]).sort((a, b) =>
      a.localeCompare(b),
    );
    setFieldValue(result, field, sortedArray);
  });

  return result;
};

export default getUniqueValuesPerField;
