import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuesReportsComponent } from './dues-reports/dues-reports.component';
import { ConsolidatedLoansComponent } from './consolidated-loans/consolidated-loans.component';
import { LoanCompilationComponent } from './loan-compilation/loan-compilation.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { PortfolioSegmentationComponent } from './portfolio-segmentation/portfolio-segmentation.component';
import { PortfolioAtRiskComponent } from './portfolio-at-risk/portfolio-at-risk.component';
import { RiskFlaggingComponent } from './risk-flagging/risk-flagging.component';
import { PortfolioStatusComponent } from './portfolio-status/portfolio-status.component';
import { RateOfRenewalComponent } from './rate-of-renewal/rate-of-renewal.component';
import { AuthGuard } from '../AuthGuard.service';
import { MonthlyStatusComponent } from './monthly-status/monthly-status.component';
import { LoanUtilizationComponent } from './loan-utilization/loan-utilization.component';
import { PortfolioAtRiskTimeComponent } from './portfolio-at-risk-time/portfolio-at-risk-time.component';
import { FemaleParticipationRatioComponent } from './female-participation-ratio/female-participation-ratio.component';
import { BranchTargetManagmentComponent } from './branch-target-managment/branch-target-managment.component';
import { PortfolioStatusDurationComponent } from './portfolio-status-duration/portfolio-status-duration.component';
import { AttendanceMonitoringComponent } from './attendance-monitoring/attendance-monitoring.component';
import { AgenciesTargetTrackingReportComponent } from './agencies-target-tracking-report/agencies-target-tracking-report.component';
import { Sales2PendingReportComponent } from './sales2-pending-report/sales2-pending-report.component';

export const routes: Routes = [
  { path: 'dues-report', component: DuesReportsComponent },
  { path: 'consolidated-loans', component: ConsolidatedLoansComponent },
  { path: 'loan-compilation', component: LoanCompilationComponent, canActivate: [AuthGuard] },
  { path: 'op-portfolio-segmentation', component: PortfolioSegmentationComponent, canActivate: [AuthGuard] },
  { path: 'op-portfolio-at-risk', component: PortfolioAtRiskComponent, canActivate: [AuthGuard] },
  { path: 'app-risk-flagging', component: RiskFlaggingComponent, canActivate: [AuthGuard] },
  { path: 'op-portfolio-status', component: PortfolioStatusComponent, canActivate: [AuthGuard] },
  { path: 'rate-of-renewal', component: RateOfRenewalComponent, canActivate: [AuthGuard] },
  { path: 'monthly-status', component: MonthlyStatusComponent, canActivate: [AuthGuard] },
  { path: 'loan-utlization', component: LoanUtilizationComponent, canActivate: [AuthGuard] },
  { path: 'opp-portfolio-at-risk-time-series', component: PortfolioAtRiskTimeComponent, canActivate: [AuthGuard] },
  { path: 'op-female-participation-ratio', component: FemaleParticipationRatioComponent, canActivate: [AuthGuard] },
  { path: 'branch-target-managment', component: BranchTargetManagmentComponent, canActivate: [AuthGuard] },
  { path: 'oop-portfolio-status-duration', component: PortfolioStatusDurationComponent, canActivate: [AuthGuard] },
  { path: 'attendance-monitoring', component: AttendanceMonitoringComponent, canActivate: [AuthGuard] },
  { path: 'agencies-target-tracking', component: AgenciesTargetTrackingReportComponent, canActivate: [AuthGuard] },
  { path: 'sales-2-pending', component: Sales2PendingReportComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    NgSelectModule, MatAutocompleteModule, MatInputModule,
  ],
  declarations: [DuesReportsComponent, ConsolidatedLoansComponent, LoanCompilationComponent, PortfolioSegmentationComponent, PortfolioAtRiskComponent, RiskFlaggingComponent, PortfolioStatusComponent, RateOfRenewalComponent, MonthlyStatusComponent, LoanUtilizationComponent, PortfolioAtRiskTimeComponent, FemaleParticipationRatioComponent, BranchTargetManagmentComponent, PortfolioStatusDurationComponent, AttendanceMonitoringComponent, AgenciesTargetTrackingReportComponent, Sales2PendingReportComponent],
  providers: [AuthGuard]
})
export class OperationsModule { }
