import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { LoanInfoComponent } from './loan-info/loan-info.component';
import { MFCIBComponent } from './mfcib/mfcib.component';
import { InsuranceInfoComponent } from './insurance-info/insurance-info.component';
import { NomineeComponent } from './nominee/nominee.component';
import { CoBorrowerComponent } from './co-borrower/co-borrower.component';
import { BusinessAppraisalComponent } from './business-appraisal/business-appraisal.component';
import { SchoolAppraisalComponent } from './school-appraisal/school-appraisal.component';
import { LoanUtilizationComponent } from './loan-utilization/loan-utilization.component';
import { PscComponent } from './psc/psc.component';
import { DocumentsComponent } from './documents/documents.component';
import { SubmitApplicationComponent } from './submit-application/submit-application.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ClientRelativesComponent } from './client-relatives/client-relatives.component';
import { NextOfKinComponent } from './next-of-kin/next-of-kin.component';
import { SchoolInformationComponent } from './school-information/school-information.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatRadioModule, MatCardModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { LivestockAppraisalComponent } from './livestock-appraisal/livestock-appraisal.component';
import { HilAppraisalComponent } from './hil-appraisal/hil-appraisal.component';
// import { NoDblClickDirective } from 'src/app/shared/directives/double-click-preventing.directive';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'personal-info'
  },
  {
    path: 'personal-info',
    component: PersonalInfoComponent,
  }, 
  {
    path: 'loan-info',
    component: LoanInfoComponent
  },
  {
    path: 'mfcib',
    component: MFCIBComponent
  },
  {
    path: 'insurance-info',
    component: InsuranceInfoComponent
  },
  {
    path: 'nominee',
    component: NomineeComponent
  },
  {
    path: 'co-borrower',
    component: CoBorrowerComponent
  },
  {
    path: 'business-appraisal',
    component: BusinessAppraisalComponent
  },
  {
    path: 'live-stock-appraisal',
    component: LivestockAppraisalComponent
  },
  {
    path: 'school-appraisal',
    component: SchoolAppraisalComponent
  },
  {
    path: 'expected-loan-utilication',
    component: LoanUtilizationComponent
  },
  {
    path: 'psc',
    component: PscComponent
  },
  {
    path: 'documents',
    component: DocumentsComponent
  },
  {
    path: 'submit',
    component: SubmitApplicationComponent
  },
  {
    path: 'next-of-kin',
    component: NextOfKinComponent
  },
  {
    path: 'client-relatives',
    component: ClientRelativesComponent
  },
  {
    path: 'school-information',
    component: SchoolInformationComponent
  },
  {
    path: 'hil-appraisal',
    component: HilAppraisalComponent
  }
];
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
    MatIconModule
  ],
  declarations: [
    // NoDblClickDirective,
    PersonalInfoComponent,
    LoanInfoComponent,
    MFCIBComponent,
    InsuranceInfoComponent,
    NomineeComponent,
    CoBorrowerComponent,
    BusinessAppraisalComponent,
    SchoolAppraisalComponent,
    LoanUtilizationComponent,
    PscComponent,
    DocumentsComponent,
    SubmitApplicationComponent,
    BreadcrumbComponent,
    ClientRelativesComponent,
    NextOfKinComponent,
    SchoolInformationComponent,
    LivestockAppraisalComponent,
    HilAppraisalComponent
  ],
  providers: [{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }]
})
export class LoanAppModule { }
