import { Routes, RouterModule } from '@angular/router';
import { NgModule} from '@angular/core';
import {BasicInfoComponent} from './info/basic-info.component';
import {ProductRulesComponent} from './product-rules/product-rules.component';
import {FormsAssignmentComponent} from './forms-assignment/forms-assignment.component';
import {AccountingSetupComponent} from './accounting-setup/accounting-setup.component';
import {ChargesComponent} from './charges/charges.component';
import {DocumentsAssignmentComponent} from './documents-assignment/documents-assignment.component';
import {AdjustmentSequenceComponent} from './adjustment-sequence/adjustment-sequence.component';
import {BusinessSectorComponent} from './business-sector/business-sector.component';
import { AssociateProductAssignment } from './associate-product-assignment/associate-product-assignment.component';

export const routes: Routes = [
  { path: '',
    redirectTo: 'info'
    }, // default route of the module
    { path: 'product-info' ,
    component: BasicInfoComponent,
    data: {
      breadcrumbs: [
        {label: 'Basic Info', href: '/setup/addProduct/product-info'},
        {label: 'Product Rules', href: '/setup/addProduct/rules'},
        {label: 'Charges', href: '/setup/addProduct/charges'},
        {label: 'Accounting setup', href: '/setup/addProduct/accounting-setup'},
        {label: 'Forms Assignment', href: '/setup/addProduct/forms-assignment'},
        {label: 'Documents Assignment', href: '/setup/addProduct/documents-assignment'},
        {label: 'Adjustment Sequence', href: '/setup/addProduct/adjustment-sequence'},
        {label: 'Business Sector', href: '/setup/addProduct/business-sector'}
      ]
    }
  },
  { path: 'info' ,
    component: BasicInfoComponent,
    data: {
      breadcrumbs: [
        {label: 'Basic Info', href: '/setup/addProduct/info'}
      ]
    }
  },
  { path: 'rules' ,
    component: ProductRulesComponent,
    data: {
      breadcrumbs: [
        {label: 'Basic Info', href: '/setup/addProduct/product-info'},
        {label: 'Product Rules', href: '/setup/addProduct/rules'},
        {label: 'Charges', href: '/setup/addProduct/charges'},
        {label: 'Accounting setup', href: '/setup/addProduct/accounting-setup'},
        {label: 'Forms Assignment', href: '/setup/addProduct/forms-assignment'},
        {label: 'Documents Assignment', href: '/setup/addProduct/documents-assignment'},
        {label: 'Adjustment Sequence', href: '/setup/addProduct/adjustment-sequence'},
        {label: 'Business Sector', href: '/setup/addProduct/business-sector'}
      ]
    }
  },
  { path: 'charges' ,
    component: ChargesComponent ,
    data: {
      breadcrumbs: [
        {label: 'Basic Info', href: '/setup/addProduct/product-info'},
        {label: 'Product Rules', href: '/setup/addProduct/rules'},
        {label: 'Charges', href: '/setup/addProduct/charges'},
        {label: 'Accounting setup', href: '/setup/addProduct/accounting-setup'},
        {label: 'Forms Assignment', href: '/setup/addProduct/forms-assignment'},
        {label: 'Documents Assignment', href: '/setup/addProduct/documents-assignment'},
        {label: 'Adjustment Sequence', href: '/setup/addProduct/adjustment-sequence'},
        {label: 'Business Sector', href: '/setup/addProduct/business-sector'}
      ]
    }
  },
  { path: 'accounting-setup',
    component: AccountingSetupComponent ,
    data: {
      breadcrumbs: [
        {label: 'Basic Info', href: '/setup/addProduct/product-info'},
        {label: 'Product Rules', href: '/setup/addProduct/rules'},
        {label: 'Charges', href: '/setup/addProduct/charges'},
        {label: 'Accounting setup', href: '/setup/addProduct/accounting-setup'},
        {label: 'Forms Assignment', href: '/setup/addProduct/forms-assignment'},
        {label: 'Documents Assignment', href: '/setup/addProduct/documents-assignment'},
        {label: 'Adjustment Sequence', href: '/setup/addProduct/adjustment-sequence'},
        {label: 'Business Sector', href: '/setup/addProduct/business-sector'}
      ]
    }},
  { path: 'forms-assignment',
    component: FormsAssignmentComponent ,
    data: {
      breadcrumbs: [
        {label: 'Basic Info', href: '/setup/addProduct/product-info'},
        {label: 'Product Rules', href: '/setup/addProduct/rules'},
        {label: 'Charges', href: '/setup/addProduct/charges'},
        {label: 'Accounting setup', href: '/setup/addProduct/accounting-setup'},
        {label: 'Forms Assignment', href: '/setup/addProduct/forms-assignment'},
        {label: 'Documents Assignment', href: '/setup/addProduct/documents-assignment'},
        {label: 'Adjustment Sequence', href: '/setup/addProduct/adjustment-sequence'},
        {label: 'Business Sector', href: '/setup/addProduct/business-sector'}
      ]
    }},
  { path: 'documents-assignment',
    component: DocumentsAssignmentComponent ,
    data: {
      breadcrumbs: [
        {label: 'Basic Info', href: '/setup/addProduct/product-info'},
        {label: 'Product Rules', href: '/setup/addProduct/rules'},
        {label: 'Charges', href: '/setup/addProduct/charges'},
        {label: 'Accounting setup', href: '/setup/addProduct/accounting-setup'},
        {label: 'Forms Assignment', href: '/setup/addProduct/forms-assignment'},
        {label: 'Documents Assignment', href: '/setup/addProduct/documents-assignment'},
        {label: 'Adjustment Sequence', href: '/setup/addProduct/adjustment-sequence'},
        {label: 'Business Sector', href: '/setup/addProduct/business-sector'}
      ]
    }},
  { path: 'adjustment-sequence',
    component: AdjustmentSequenceComponent ,
    data: {
      breadcrumbs: [
        {label: 'Basic Info', href: '/setup/addProduct/product-info'},
        {label: 'Product Rules', href: '/setup/addProduct/rules'},
        {label: 'Charges', href: '/setup/addProduct/charges'},
        {label: 'Accounting setup', href: '/setup/addProduct/accounting-setup'},
        {label: 'Forms Assignment', href: '/setup/addProduct/forms-assignment'},
        {label: 'Documents Assignment', href: '/setup/addProduct/documents-assignment'},
        {label: 'Adjustment Sequence', href: '/setup/addProduct/adjustment-sequence'},
        {label: 'Business Sector', href: '/setup/addProduct/business-sector'}
      ]
    }},
  { path: 'business-sector',
    component: BusinessSectorComponent ,
    data: {
      breadcrumbs: [
        {label: 'Basic Info', href: '/setup/addProduct/product-info'},
        {label: 'Product Rules', href: '/setup/addProduct/rules'},
        {label: 'Charges', href: '/setup/addProduct/charges'},
        {label: 'Accounting setup', href: '/setup/addProduct/accounting-setup'},
        {label: 'Forms Assignment', href: '/setup/addProduct/forms-assignment'},
        {label: 'Documents Assignment', href: '/setup/addProduct/documents-assignment'},
        {label: 'Adjustment Sequence', href: '/setup/addProduct/adjustment-sequence'},
        {label: 'Business Sector', href: '/setup/addProduct/business-sector'}
      ]
    }},
    { path: 'associate-product-assignment',
      component: AssociateProductAssignment ,
      data: {
        breadcrumbs: [
          {label: 'Basic Info', href: '/setup/addProduct/product-info'},
          {label: 'Product Rules', href: '/setup/addProduct/rules'},
          {label: 'Charges', href: '/setup/addProduct/charges'},
          {label: 'Accounting setup', href: '/setup/addProduct/accounting-setup'},
          {label: 'Forms Assignment', href: '/setup/addProduct/forms-assignment'},
          {label: 'Documents Assignment', href: '/setup/addProduct/documents-assignment'},
          {label: 'Adjustment Sequence', href: '/setup/addProduct/adjustment-sequence'},
          {label: 'Business Sector', href: '/setup/addProduct/business-sector'},
          {label: 'Associate Product Assignment', href: '/setup/addProduct/associate-product-assignment'}
        ]
      }}
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
  bootstrap: [BasicInfoComponent]
})
export class AddProductRouting { }
