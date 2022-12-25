import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './layouts/admin/admin.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard', component: AdminComponent,
    loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'setup',
    component: AdminComponent,
    loadChildren: './pages/setup/setup.module#SetupModule'
  },
  {
    path: 'loan-origination',
    component: AdminComponent,
    loadChildren: './pages/loan-origination/loan-origination.module#LoanOriginationModule'
  },
  {
    path: 'disbursement',
    component: AdminComponent,
    loadChildren: './pages/disbursement/disbursement.module#DisbursementModule'
  },
  {
    path: 'recovery',
    component: AdminComponent,
    loadChildren: './pages/recovery/recovery.module#RecoveryModule'
  },
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren: './pages/admin/admin.module#AdminModule'
  },
  {
    path: 'expense-management',
    component: AdminComponent,
    loadChildren: './pages/expense-management/expense-management.module#ExpenseManagementModule'
  },
  {
    path: 'reports',
    component: AdminComponent,
    loadChildren: './pages/report/report.module#ReportModule'
  },
  {
    path: 'compliance',
    component: AdminComponent,
    loadChildren: './pages/compliance/compliance.module#ComplianceModule'
  },
  {
    path: 'training',
    component: AdminComponent,
    loadChildren: './pages/training/training.module#TrainingModule'
  },
  {
    path: 'cnic-expiry',
    component: AdminComponent,
    loadChildren: './pages/cnic-expiry/cnic-expiry.module#CnicExpiryModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
