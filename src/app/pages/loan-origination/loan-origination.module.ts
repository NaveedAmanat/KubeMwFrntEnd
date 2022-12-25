import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatTableModule,
  MatPaginator,
  MatPaginatorModule,
  MatSortModule,
  MatIconModule
} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {SharedModule} from '../../shared/shared.module';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import { CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot } from '@angular/router';

import { ClientHistoryComponent } from './client-history/client-history.component';
import { SplitPipe } from './client-history/SplitPipe.pipe';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { AuthGuard } from './AuthGuard.service';
export const routes: Routes = [
  { path: '',
    redirectTo: 'landing',canActivate: [AuthGuard]
    }, // default route of the module
  { path: 'landing' ,
    component: LandingComponent,canActivate: [AuthGuard]
  },
  // { path: 'personal-info' ,
  //   component: PersonalInfoComponent,
  // },
  // { path: 'loan-info' ,
  //   component: LoanInfoComponent
  // },
  // { path: 'mfcib' ,
  //   component: MFCIBComponent
  // },
  // { path: 'insurance-info' ,
  //   component: InsuranceInfoComponent
  // },
  // { path: 'nominee' ,
  //   component: NomineeComponent
  // },
  // { path: 'co-borrower' ,
  //   component: CoBorrowerComponent
  // },
  // { path: 'business-appraisal' ,
  //   component: BusinessAppraisalComponent
  // },
  // { path: 'school-appraisal' ,
  //   component: SchoolAppraisalComponent
  // },
  // { path: 'expected-loan-utilication' ,
  //   component: LoanUtilizationComponent
  // },
  // { path: 'psc' ,
  //   component: PscComponent
  // },
  // { path: 'documents' ,
  //   component: DocumentsComponent
  // },
  // { path: 'submit' ,
  //   component: SubmitApplicationComponent
  // },
  // { path: 'next-of-kin' ,
  //   component: NextOfKinComponent
  // },
  // { path: 'client-relatives' ,
  //   component: ClientRelativesComponent
  // },
  // { path: 'school-information' ,
  //   component: SchoolInformationComponent
  // },
  { path: 'client-history' ,
    component: ClientHistoryComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'app',
    loadChildren: './loan-app/loan-app.module#LoanAppModule',canActivate: [AuthGuard]
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
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule ,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatMomentDateModule
    
  ],
  declarations: [
    LandingComponent,
    // PersonalInfoComponent,
    // LoanInfoComponent,
    // MFCIBComponent,
    // InsuranceInfoComponent,
    // NomineeComponent,
    // CoBorrowerComponent,
    // BusinessAppraisalComponent,
    // SchoolAppraisalComponent,
    // LoanUtilizationComponent,
    // PscComponent,
    // DocumentsComponent,
    // SubmitApplicationComponent,
    // BreadcrumbComponent,
    // ClientRelativesComponent,
    // NextOfKinComponent,
    // SchoolInformationComponent,
    ClientHistoryComponent,
    SplitPipe
  ],
  providers: [AuthGuard,{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }]
})
export class LoanOriginationModule { }
 