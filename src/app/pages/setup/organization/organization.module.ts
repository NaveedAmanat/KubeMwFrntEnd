import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {CommunityComponent} from './community/community.component';
import {AreaComponent} from './area/area.component';
import {BranchComponent} from './branch/branch.component';
import {OrganizationComponent} from './organization.component';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule
  ],
  declarations: [
    OrganizationComponent,
    AreaComponent,
    BranchComponent,
    CommunityComponent,
    PortfolioComponent]
})
export class OrganizationModule { }
