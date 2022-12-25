import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchInfoComponent } from './branch-info/branch-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatRadioModule, MatCardModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { BankInfoComponent } from './bank-info/bank-info.component';
import { ProductsComponent } from './products/products.component';
import { PortLocInfoComponent } from './port-loc-info/port-loc-info.component';
import { UcComponent } from './uc/uc.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CommunityComponent } from './community/community.component';

/* Authored by Areeba
   Branch Setup
*/

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'branch-info'
  },
  {
    path: 'branch-info',
    component: BranchInfoComponent,
  }, 
  {
    path: 'bank-info',
    component: BankInfoComponent,
  }, 
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'port-loc-info',
    component: PortLocInfoComponent,
  },
  {
    path: 'uc',
    component: UcComponent,
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
  },
  {
    path: 'community',
    component: CommunityComponent,
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMomentDateModule,
    MatIconModule,
  ],
  declarations: [BranchInfoComponent,
  BreadcrumbComponent,
  BankInfoComponent,
  ProductsComponent,
  PortLocInfoComponent,
  UcComponent,
  PortfolioComponent,
  CommunityComponent]
})
export class BranchModule { }
