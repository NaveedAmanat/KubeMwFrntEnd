import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BasicInfoComponent} from './info/basic-info.component';
import {SharedModule} from '../../../../shared/shared.module';
import {BreadCrumbComponent} from '../../../../shared/bread-crumb/bread-crumb.component';
import { ProductRulesComponent } from './product-rules/product-rules.component';
import { ChargesComponent } from './charges/charges.component';
import { AccountingSetupComponent } from './accounting-setup/accounting-setup.component';
import { FormsAssignmentComponent } from './forms-assignment/forms-assignment.component';
import {AddProductRouting} from './AddProduct.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { DocumentsAssignmentComponent } from './documents-assignment/documents-assignment.component';
import { AdjustmentSequenceComponent } from './adjustment-sequence/adjustment-sequence.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {MatInputModule} from '../../../../../../node_modules/@angular/material/input';
import { BusinessSectorComponent } from './business-sector/business-sector.component';
import { AssociateProductAssignment } from './associate-product-assignment/associate-product-assignment.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AddProductRouting,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule
  ],
  declarations: [
    BasicInfoComponent,
    ProductRulesComponent,
    ChargesComponent,
    AccountingSetupComponent,
    FormsAssignmentComponent,
    DocumentsAssignmentComponent,
    AdjustmentSequenceComponent,
    BusinessSectorComponent,
    AssociateProductAssignment
  ],
  exports: []
})
export class AddProductModule { }
