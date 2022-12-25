import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetManagmentComponent } from './target-managment/target-managment.component';
import { CategoriesComponent } from './categories/categories.component';
import { ActionSubCategoriesComponent } from './action-sub-categories/action-sub-categories.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule } from '@angular/material';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { IssuesComponent } from './issues/issues.component';
import { DeviceRegisterComponent } from './device-register/device-register.component';
import { NgSelectModule } from '@ng-select/ng-select';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'target-managment'
  },
  {
    path: 'target-managment',
    component: TargetManagmentComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'action-sub-categories/:adtCtgrySeq',
    component: ActionSubCategoriesComponent
  },
  {
    path: 'issues/:sbCtgrySeq',
    component: IssuesComponent
  },
  {
    path: 'device-register',
    component: DeviceRegisterComponent
  }
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
    MatButtonModule,
    NgSelectModule
  ],
  declarations: [TargetManagmentComponent, CategoriesComponent, ActionSubCategoriesComponent, LeftSideBarComponent, IssuesComponent, DeviceRegisterComponent]
})
export class ComplianceSetupModule { }
