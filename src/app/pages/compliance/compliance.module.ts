import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceComponent } from './compliance/compliance.component';
import { Routes, RouterModule } from '@angular/router';
import { ComplianceBranchComponent } from './compliance-branch/compliance-branch.component';
import { MatInputModule, MatDatepickerModule, MatSelectModule, MatMenuModule, MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatTreeModule} from '@angular/material/tree';




export const routes: Routes = [
  {
    path: '',
    redirectTo: 'branch'
  },
  {
    path: 'branch',
    component: ComplianceComponent
  },
  {
    path: 'compliance-branch',
    component: ComplianceBranchComponent
  },
  {
    path: 'compliance-visit',
    loadChildren: './compliance-visit/compliance-visit.module#ComplianceVisitModule'
  },
  {
    path: 'compliance-setup',
    loadChildren: './compliance-setup/compliance-setup.module#ComplianceSetupModule'
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    NgSelectModule,
    CdkTableModule,
    CdkTreeModule,
    MatTreeModule
  ],
  declarations: [ComplianceComponent, ComplianceBranchComponent]
})
export class ComplianceModule { }
