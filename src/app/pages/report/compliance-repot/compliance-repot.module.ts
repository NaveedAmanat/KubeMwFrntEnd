import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmlReportComponent } from './aml-report/aml-report.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { CnicExpiryComponent } from './cnic-expiry/cnic-expiry.component';


export const routes: Routes = [
  { path: '', redirectTo:'aml-matches' },
  { path: 'aml-matches', component: AmlReportComponent },
  { path: 'cnic-match', component: CnicExpiryComponent },
  
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,MatRadioModule,
    NgSelectModule, MatAutocompleteModule, MatInputModule, MatRadioModule
  ],
  declarations: [AmlReportComponent, CnicExpiryComponent]
})
export class ComplianceRepotModule { }
 