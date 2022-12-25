import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdvanceRecoveryReportOverallComponent } from './advance-recovery-report-overall/advance-recovery-report-overall.component';
import { AuthGuard } from '../../admin/AuthGuard.service';
import { PendingLoanUtilizationComponent } from './pending-loan-utilization/pending-loan-utilization.component';
import { LateClosingReportComponent } from './late-closing-report/late-closing-report.component';
import { AdvanceClientReportComponent } from './advance-client-report/advance-client-report.component';
import { AdvanceMaturityReportComponent } from './advance-maturity-report/advance-maturity-report.component';
import { WeeklyTargetReportComponent } from './weekly-target-report/weekly-target-report.component';
import { AreaDisbursmentReportComponent } from './area-disbursment-report/area-disbursment-report.component';

export const routes: Routes = [
  { path: 'advance-recovery-overall', component: AdvanceRecoveryReportOverallComponent},
  { path: 'pending-loan-utilization', component: PendingLoanUtilizationComponent},
  { path: 'late-closing', component: LateClosingReportComponent},
  { path: 'advance-client-report', component: AdvanceClientReportComponent},
  { path: 'advance-maturity-report', component: AdvanceMaturityReportComponent},
  { path: 'weekly-target-report', component: WeeklyTargetReportComponent},
  { path: 'area-disbursement-report', component: AreaDisbursmentReportComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    NgSelectModule, MatAutocompleteModule, MatInputModule,
  ],
  declarations: [AdvanceRecoveryReportOverallComponent, PendingLoanUtilizationComponent, LateClosingReportComponent, AdvanceClientReportComponent, AdvanceMaturityReportComponent, WeeklyTargetReportComponent, AreaDisbursmentReportComponent,]
})
export class OperationalReportsModule { }
