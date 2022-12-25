import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SetupComponent } from './setup.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductsComponent } from './products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RulesComponent } from './rules/rules.component';
import { AddRuleComponent } from './rules/add-rule/add-rule.component';
import { AddressTypeComponent } from './address-type/address-type.component';
import { DataTablesModule } from 'angular-datatables';
import { ApprovalWorkflowComponent } from './approval-workflow/approval-workflow.component';
import { AddWorkflowComponent } from './approval-workflow/add-workflow/add-workflow.component';
import { CommonCodeValuesComponent } from './common-code-values/common-code-values.component';
import { CityComponent } from './city/city.component';
import { PaymentTypesComponent } from './types/payment-types/payment-types.component';
import { ExpenseTypesComponent } from './types/expense-types/expense-types.component';
import { CommonCodeComponent } from './common-code/common-code.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatExpansionModule,
  MatListModule,
  MatFormFieldModule
} from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { ChargeTypesComponent } from './types/charge-types/charge-types.component';
import { RecoveryTypesComponent } from './types/recovery-types/recovery-types.component';
import { ProductBySeqComponent } from './products/product-by-seq/product-by-seq.component';
import { HealthInsurancePlanComponent } from './health-insurance-plan/health-insurance-plan.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { QuestionComponent } from './question/question.component';
import { BusinessSectorComponent } from './business-sector/business-sector.component';
import { BusinessActivityComponent } from './business-activity/business-activity.component';
import { AnswerComponent } from './answer/answer.component';
import { TagsComponent } from './tags/tags.component';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Auth } from '../../shared/models/Auth.model';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGuard } from './AuthGuard.service';
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { UserManagmentComponent } from './user-managment/user-managment.component';
import { LandingComponent } from './branch-setup/landing/landing.component'; 
import { TravellingComponent } from './travelling/travelling.component';
import { RsRuleComponent } from './rs-rule/rs-rule.component';
import { HolidaysExemptionComponent } from './holidays-exemption/holidays-exemption.component';

export const routes: Routes = [
  {
    path: '',
    component: SetupComponent, canActivate: [AuthGuard]
  }, // default route of the module
  //Modified by Areeba - 15-11-2022 - Landing for Setup Tab
  { path: 'common-codes', component: CommonCodeComponent, canActivate: [AuthGuard] },

  { path: 'common-code-values/:id', component: CommonCodeValuesComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'products/:prdGrpNm/:id', component: ProductBySeqComponent, canActivate: [AuthGuard] },
  { path: 'addProduct', loadChildren: './products/Add-Product/add-product.module#AddProductModule', canActivate: [AuthGuard] },
  { path: 'rules', component: RulesComponent, canActivate: [AuthGuard] },
  { path: 'rules/:id', component: AddRuleComponent, canActivate: [AuthGuard] },
  // { path: 'common-codes/:id', component: AddressTypeComponent },
  { path: 'organization', loadChildren: './organization/organization.module#OrganizationModule', canActivate: [AuthGuard] },
  { path: 'geography', loadChildren: './geography/geograpthy.module#GeograpthyModule', canActivate: [AuthGuard] },
  { path: 'approval-workflow', component: ApprovalWorkflowComponent, canActivate: [AuthGuard] },
  { path: 'approval-workflow/add-workflow', component: AddWorkflowComponent, canActivate: [AuthGuard] },
  { path: 'communication-workflow', loadChildren: './communication-workflow/communicatoin-workflow.module#CommunicatoinWorkflowModule', canActivate: [AuthGuard] },
  { path: 'city', component: CityComponent, canActivate: [AuthGuard] },
  { path: 'payment-types', component: PaymentTypesComponent, canActivate: [AuthGuard] },
  { path: 'expense-types', component: ExpenseTypesComponent, canActivate: [AuthGuard] },
  { path: 'charge-types', component: ChargeTypesComponent, canActivate: [AuthGuard] },
  { path: 'recovery-types', component: RecoveryTypesComponent, canActivate: [AuthGuard] },
  { path: 'health-insurance-plan', component: HealthInsurancePlanComponent, canActivate: [AuthGuard] },
  { path: 'tag', component: TagsComponent, canActivate: [AuthGuard] },
  { path: 'Questionnaire', component: QuestionnaireComponent, canActivate: [AuthGuard] },
  { path: 'question', component: QuestionComponent, canActivate: [AuthGuard] },
  { path: 'answer', component: AnswerComponent, canActivate: [AuthGuard] },
  { path: 'business-sector', component: BusinessSectorComponent, canActivate: [AuthGuard] },
  { path: 'business-activity', component: BusinessActivityComponent, canActivate: [AuthGuard] },
  { path: 'file-upload', component: FileLoaderComponent, canActivate: [AuthGuard] },
  { path: 'user-managment', component: UserManagmentComponent, canActivate: [AuthGuard] },
  //Added by Areeba - Branch Setup
  { path: 'branch-setup', component: LandingComponent, canActivate: [AuthGuard] }, 
  {
    path: 'branch',
    loadChildren: './branch-setup/branch/branch.module#BranchModule',canActivate: [AuthGuard] 
  },
  //Ended by Areeba
  
  //Added by Areeba - HR Travelling SCR - Dated - 07-06-2022
  { path: 'travelling', component: TravellingComponent, canActivate: [AuthGuard] },

  //Added by Areeba - Rescheduling Rules - Dated - 27-09-2022
  { path: 'rs-rule', component: RsRuleComponent, canActivate: [AuthGuard] },

  // { path: 'consolidated-types', component: TypesConsolidatedComponent, canActivate: [AuthGuard] },

  { path: 'holidays-exemption', component: HolidaysExemptionComponent, canActivate: [AuthGuard] },
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    DataTablesModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatListModule,
    MatFormFieldModule
  ],
  declarations: [
    SetupComponent,
    CommonCodeValuesComponent,
    ProductsComponent,
    RulesComponent,
    AddRuleComponent,
    AddressTypeComponent,
    ApprovalWorkflowComponent,
    AddWorkflowComponent,
    PaymentTypesComponent,
    ExpenseTypesComponent,
    CityComponent,
    CommonCodeComponent,
    ChargeTypesComponent,
    RecoveryTypesComponent,
    ProductBySeqComponent,
    HealthInsurancePlanComponent,
    TagsComponent,
    QuestionnaireComponent,
    QuestionComponent,
    AnswerComponent,
    BusinessSectorComponent,
    BusinessActivityComponent,
    FileLoaderComponent,
    UserManagmentComponent,
    LandingComponent,   
    TravellingComponent, 
    RsRuleComponent, HolidaysExemptionComponent
  ],
  providers: [AuthGuard]
})
export class SetupModule { }

