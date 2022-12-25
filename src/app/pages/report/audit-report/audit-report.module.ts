import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { AnalysisAuditComponent } from './analysis-audit/analysis-audit.component';
import { SamplingAuditComponent } from './sampling-audit/sampling-audit.component';

export const routes: Routes = [
  { path: 'analysis-audit', component: AnalysisAuditComponent },
  { path: 'sampling-audit', component: SamplingAuditComponent }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,MatRadioModule,
    NgSelectModule, MatAutocompleteModule, MatInputModule, 
  ],
  declarations: [AnalysisAuditComponent, SamplingAuditComponent]
})
export class AuditReportModule { }
 