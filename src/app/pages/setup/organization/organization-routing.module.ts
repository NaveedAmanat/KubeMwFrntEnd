import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {CommunityComponent} from './community/community.component';
import {AreaComponent} from './area/area.component';
import {BranchComponent} from './branch/branch.component';
import {OrganizationComponent} from './organization.component';

const routes: Routes = [
  { path: '', component: OrganizationComponent },
  { path: 'area/:id', component: AreaComponent },
  { path: 'branch/:id', component: BranchComponent },
  { path: 'portfolio/:id', component: PortfolioComponent },
  { path: 'community/:id', component: CommunityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
