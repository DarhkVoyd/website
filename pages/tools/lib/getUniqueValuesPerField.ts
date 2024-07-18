import { JSONSchemaTool } from './JSONSchemaTool';
import jsonpath from 'jsonpath';

export type Fields =
  | 'languages'
  | 'supportedDialects.draft'
  | 'toolingTypes'
  | 'license';

export type UniqueValuesPerField = Partial<Record<Fields, string[]>>;

const getUniqueValuesPerField = (
  data: JSONSchemaTool[],
  path: string,
  exclude: string[] = [],
) => {
  const values = Array.from(new Set(jsonpath.query(data, path)));
  return values.filter((value) => !exclude.includes(value));
};

export default getUniqueValuesPerField;
