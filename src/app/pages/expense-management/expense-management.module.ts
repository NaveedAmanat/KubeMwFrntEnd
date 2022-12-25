import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './AuthGuard.service';
import { ExpenseComponent } from './expense/expense.component';
import { MatRadioModule, MatTableModule, MatSortModule, MatPaginatorModule, MatInputModule, MatSelectModule } from '@angular/material';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';


export const routes: Routes = [
  { path: '', redirectTo: 'expense' }, // default route of the module
  { path: 'expense', component: ExpenseComponent, canActivate: [AuthGuard] },

];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatRadioModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    NgSelectModule
  ],
  declarations: [
    ExpenseComponent,
  ],
  providers: [AuthGuard]

})
export class ExpenseManagementModule { }
