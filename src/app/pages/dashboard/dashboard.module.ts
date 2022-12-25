import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './bdo-dashboard/dashboard.component';
import { BmDashboardComponent } from './bm-dashboard/bm-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  declarations: [DashboardComponent, BmDashboardComponent]
})
export class DashboardModule { }
