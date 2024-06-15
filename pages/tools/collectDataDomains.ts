import { type Tooling } from './index.page';

export type DataFields = 'license' | 'languages';
export type DataDomainsWithoutDrafts = Partial<
  Record<DataFields, Array<string>>
>;
export interface DataDomains extends DataDomainsWithoutDrafts {
  drafts: string[];
}

const collectDataDomains = (data: Tooling[], ...fields: DataFields[]) => {
  const dataDomainsCollector: Partial<Record<DataFields, Set<string>>> = {};
  for (const field of fields) {
    dataDomainsCollector[field] = new Set();
  }
  for (const item of data) {
    for (const field of fields) {
      if (item[field] !== undefined) {
        const value = item[field];
        if (Array.isArray(value)) {
          for (const element of value) {
            dataDomainsCollector[field]!.add(element);
          }
        } else {
          dataDomainsCollector[field]!.add(value as string);
        }
      }
    }
  }

  const dataDomains: Partial<Record<DataFields, Array<string>>> = {};
  for (const field of fields) {
    if (dataDomainsCollector[field]) {
      dataDomains[field] = Array.from(
        dataDomainsCollector[field] as Set<string>,
      );
    }
  }
  return dataDomains;
};

export default collectDataDomains;
