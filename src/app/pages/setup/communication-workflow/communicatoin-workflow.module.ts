import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicatoinWorkflowRoutingModule } from './communicatoin-workflow-routing.module';
import {CommunicationWorkflowComponent} from './communication-workflow.component';
import {AddWorkflowRuleComponent} from './add-workflow-rule/add-workflow-rule.component';
import {AddWorkflowActionComponent} from './add-workflow-action/add-workflow-action.component';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CommunicatoinWorkflowRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  declarations: [
    CommunicationWorkflowComponent,
    AddWorkflowActionComponent,
    AddWorkflowRuleComponent
  ]
})
export class CommunicatoinWorkflowModule { }
