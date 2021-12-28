import {objectType} from 'nexus';

export const CountInput = objectType({
  name: 'CountInput',
  definition(t) {
    t.int('TotalCount');
    t.int('pageCount');
  },
});
