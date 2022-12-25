import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './bdo-dashboard/dashboard.component';
import { BmDashboardComponent } from './bm-dashboard/bm-dashboard.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'bdo', component: DashboardComponent },
  { path: "bm", component:BmDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
