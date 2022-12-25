import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisbursementRoutingModule } from './disbursement-routing.module';
import { DisbursementComponent } from './disbursement.component';
import { DisbursementVoucherComponent } from './disbursement-voucher/disbursement-voucher.component';
import { PaymentScheduleComponent } from './payment-schedule/payment-schedule.component';
import { PdcsComponent } from './pdcs/pdcs.component';
import { VoucherInfoComponent } from './voucher-info/voucher-info.component';
import { AuthService } from './auth.service';
import { CanActivateRouteGuard } from './can-activate-route.guard';

import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatCheckboxModule,
  MAT_DATE_FORMATS,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgencyComponent } from './agency/agency.component';
import { SharedModule } from '../../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { AuthGuard } from './AuthGuard.service';
import { EditPdcComponent } from './edit-pdc/edit-pdc.component';
import { EditVoucherComponent } from './edit-voucher/edit-voucher.component';
// import { NoDblClickDirective } from 'src/app/shared/directives/double-click-preventing.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DisbursementRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    DataTablesModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    SharedModule

  ],
  declarations: [
    DisbursementComponent,
    DisbursementVoucherComponent,
    PaymentScheduleComponent,
    PdcsComponent,
    VoucherInfoComponent,
    AgencyComponent,
    EditPdcComponent,
    EditVoucherComponent,

  ],
  providers: [AuthService, CanActivateRouteGuard, AuthGuard
  ]
})
export class DisbursementModule { }
