import {Rule} from '../models/Rule.model';

export const RULES: Rule[] = [{id: 1238, name: 'Rule Name 1',
  category: 'Product', condition: 'Client gender is = M and NDI > Requested Amount / 12', status: 'Pending', comments: ''},
  { id: 123, name: 'Rule Name 1',
  category: 'Product', condition: 'Client gender is = M and NDI > Requested Amount / 12', status: 'Pending', comments: ''},
  {id: 456, name: 'Rule Name 2',
    category: 'Internal Audit', condition: 'Client gender is = M and NDI > Requested Amount / 12', status: 'Active', comments: ''},
  {id: 789, name: 'Rule Name 3',
    category: 'Product', condition: 'Client gender is = M and NDI > Requested Amount / 12', status: 'Active', comments: ''},
  {id: 1011, name: 'Rule Name 4',
    category: 'Compliance', condition: 'Client gender is = M and NDI > Requested Amount / 12', status: 'Pending', comments: ''}
];
export const RULES_CATEGORIES: string[] = ['Products', 'Compliance', 'Internal Audit'];
