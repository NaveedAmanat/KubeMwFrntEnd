import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { ComplianceVisitRoutingModule } from './compliance-visit-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientComplianceComponent } from './client-compliance/client-compliance.component';
import { ExceptionComplianceComponent } from './exception-compliance/exception-compliance.component';
import { BranchComplianceComponent } from './branch-compliance/branch-compliance.component';
import { AdcComplianceComponent } from './adc-compliance/adc-compliance.component';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule, MatDatepickerModule, MatSelectModule, MatMenuModule, MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatTreeModule} from '@angular/material/tree';

export const routes: Routes = [
  { path: '',
    redirectTo: 'client'
    }, 
    { path: 'client' ,
    component: ClientComplianceComponent,
    data: {
      breadcrumbs: [
        {label: 'Client', href: '/compliance/compliance-visit/client'},
        {label: 'Exception', href: '/compliance/compliance-visit/exception'},
        {label: 'Branch', href: '/compliance/compliance-visit/branch'},
        {label: 'ADC', href: '/compliance/compliance-visit/adc'}
      ]
    }
  },
  { path: 'exception' ,
    component: ExceptionComplianceComponent,
    data: {
      breadcrumbs: [
        {label: 'Client', href: '/compliance/compliance-visit/client'},
        {label: 'Exception', href: '/compliance/compliance-visit/exception'},
        {label: 'Branch', href: '/compliance/compliance-visit/branch'},
        {label: 'ADC', href: '/compliance/compliance-visit/adc'}
      ]
    }
  },
  { path: 'branch' ,
    component: BranchComplianceComponent,
    data: {
      breadcrumbs: [
        {label: 'Client', href: '/compliance/compliance-visit/client'},
        {label: 'Exception', href: '/compliance/compliance-visit/exception'},
        {label: 'Branch', href: '/compliance/compliance-visit/branch'},
        {label: 'ADC', href: '/compliance/compliance-visit/adc'}
      ]
    }
  },
  { path: 'adc' ,
    component: AdcComplianceComponent ,
    data: {
      breadcrumbs: [
        {label: 'Client', href: '/compliance/compliance-visit/client'},
        {label: 'Exception', href: '/compliance/compliance-visit/exception'},
        {label: 'Branch', href: '/compliance/compliance-visit/branch'},
        {label: 'ADC', href: '/compliance/compliance-visit/adc'}
      ]
    }
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    NgSelectModule,
    CdkTableModule,
    CdkTreeModule,
    MatTreeModule
  ],
  declarations: [
    ClientComplianceComponent,
    ExceptionComplianceComponent,
    BranchComplianceComponent,
    AdcComplianceComponent
  ]
})
export class ComplianceVisitModule { }
