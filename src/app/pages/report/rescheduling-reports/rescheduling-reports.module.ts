import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRecoveryStatusComponent } from './client-recovery-status/client-recovery-status.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { DueVsRecoveryComponent } from './due-vs-recovery/due-vs-recovery.component';
import { ManagmentDashboardComponent } from './managment-dashboard/managment-dashboard.component';
import { ReschedulingPortfolioComponent } from './rescheduling-portfolio/rescheduling-portfolio.component';
import { PortfolioQualityOldPortfolioComponent } from './portfolio-quality-old-portfolio/portfolio-quality-old-portfolio.component';


export const routes: Routes = [
  { path: 'client-recovery-status', component: ClientRecoveryStatusComponent },
  { path: 'due-vs-recovery', component: DueVsRecoveryComponent },
  { path: 'managment-dashboard', component: ManagmentDashboardComponent },
  { path: 'rescheduling-portfolio', component: ReschedulingPortfolioComponent },
  { path: 'portfolio-quality-old-portfolio', component: PortfolioQualityOldPortfolioComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgSelectModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  declarations: [ClientRecoveryStatusComponent, DueVsRecoveryComponent, ManagmentDashboardComponent, ReschedulingPortfolioComponent, PortfolioQualityOldPortfolioComponent]
})
export class ReschedulingReportsModule { }
