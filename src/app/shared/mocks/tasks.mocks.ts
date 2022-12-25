import {Task} from '../models/task.model';

export const TASKS: Task[] = [{id: 1, name: 'Client',
  owner: 'Abida', dueDate: '9/24/2018', completionDate: '10/24/2018'
  , description: 'new business of abida', status: 'On Hold'}
  , {id: 2, name: 'Loan No. ',
    owner: 'Shugran', dueDate: '1/12/2018', completionDate: '1/1/2019'
    , description: 'Some description here', status: 'Active'},
  {id: 1238, name: 'Rule Name 1',
    owner: 'Product', dueDate: '', completionDate: ''
    , description: '', status: 'On Hold'},
  {id: 1238, name: 'Rule Name 1',
    owner: 'Product', dueDate: '', completionDate: ''
    , description: '', status: 'Overdue'},
  {id: 1238, name: 'Rule Name 1',
    owner: 'Product', dueDate: '', completionDate: ''
    , description: '', status: 'In Progress'}
];
