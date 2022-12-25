import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommunicationWorkflowComponent} from './communication-workflow.component';
import {AddWorkflowRuleComponent} from './add-workflow-rule/add-workflow-rule.component';
import {AddWorkflowActionComponent} from './add-workflow-action/add-workflow-action.component';

const routes: Routes = [
  { path: '', component: CommunicationWorkflowComponent },
  { path: 'add-workflow-rule',
    component: AddWorkflowRuleComponent,
    data: {
      breadcrumbs: [
        {label: 'Rule', href: '/setup/communication-workflow/add-workflow-rule'}
      ]
    }
  },
  { path: 'add-workflow-rule/:id',
    component: AddWorkflowRuleComponent,
    data: {
      breadcrumbs: [
        {label: 'Rule', href: '/setup/communication-workflow/add-workflow-rule'}
      ]
    }
  },
  { path: 'add-workflow-action',
    component: AddWorkflowActionComponent,
    data: {
      breadcrumbs: [
        {label: 'Rule', href: '/setup/communication-workflow/add-workflow-rule'},
        {label: 'Workflow Action', href: '/setup/communication-workflow/add-workflow-action'}
      ]
    }
    },
  { path: 'add-workflow-action/:id', component: AddWorkflowActionComponent,
    data: {
      breadcrumbs: [
        {label: 'Rule', href: '/setup/communication-workflow/add-workflow-rule'},
        {label: 'Workflow Action', href: '/setup/communication-workflow/add-workflow-action'}
      ]
    } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicatoinWorkflowRoutingModule { }
