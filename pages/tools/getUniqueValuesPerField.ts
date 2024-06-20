import { type Tooling } from './index.page';

export type Fields = 'license' | 'languages' | 'supportedDialects.draft';

export interface Exclusions {
  [key: string]: Set<string>;
}

export type UniqueValuesPerField = Partial<Record<Fields, string[]>>;

const getFieldValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const getUniqueValuesPerField = (
  data: Tooling[],
  fields: Fields[],
  exclusions: Exclusions = {},
): UniqueValuesPerField => {
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

  const result: UniqueValuesPerField = {};
  fields.forEach((field) => {
    const sortedArray = Array.from(uniqueValuesPerField[field]).sort((a, b) =>
      a.localeCompare(b),
    );
    result[field] = sortedArray;
  });

  return result;
};

export default getUniqueValuesPerField;
