import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DisbursementComponent} from './disbursement.component';
import {DisbursementVoucherComponent} from './disbursement-voucher/disbursement-voucher.component';
import {PdcsComponent} from './pdcs/pdcs.component';
import {PaymentScheduleComponent} from './payment-schedule/payment-schedule.component';
import {AgencyComponent} from './agency/agency.component';
import {BasicInfoComponent} from '../setup/products/Add-Product/info/basic-info.component';
import { CanActivateRouteGuard } from './can-activate-route.guard';
import { AuthGuard } from './AuthGuard.service';
import { EditPdcComponent } from './edit-pdc/edit-pdc.component';
import { EditVoucherComponent } from './edit-voucher/edit-voucher.component';

const routes: Routes = [
  { path: '', component: DisbursementComponent ,canActivate: [AuthGuard]},
  { path: 'voucher', component: DisbursementVoucherComponent ,
    data: {
      breadcrumbs: [
        {label: 'Disbursement Voucher', href: '/disbursement/voucher'},
        {label: 'Payment Schedule', href: '/disbursement/payment-schedule'},
        {label: 'PDCs', href: '/disbursement/pdcs'}
        ]
    },canActivate: [AuthGuard],},
  //   { path: 'pdcs', component: VoucherInfoComponent,
  // loadChildren: './add-disbursement/add-disbursement.module#AddDisbursementModule'},
  { path: 'pdcs', component: PdcsComponent ,
    data: {
      breadcrumbs: [
        {label: 'Disbursement Voucher', href: '/disbursement/voucher'},
        {label: 'Payment Schedule', href: '/disbursement/payment-schedule'},
        {label: 'PDCs', href: '/disbursement/pdcs'}
       
      ]
    },canActivate: [CanActivateRouteGuard, AuthGuard]},
    { path: 'edit-pdcs', component: EditPdcComponent ,canActivate: [CanActivateRouteGuard, AuthGuard]},
    { path: 'edit-voucher', component: EditVoucherComponent ,canActivate: [CanActivateRouteGuard, AuthGuard]},
  { path: 'payment-schedule'
    , component: PaymentScheduleComponent ,
    data: {
      breadcrumbs: [
        {label: 'Disbursement Voucher', href: '/disbursement/voucher'},
        {label: 'Payment Schedule', href: '/disbursement/payment-schedule'},
        {label: 'PDCs', href: '/disbursement/pdcs'}
      ]
    },canActivate: [CanActivateRouteGuard, AuthGuard]},
  { path: 'agency', component: AgencyComponent ,
    data: {
      breadcrumbs: [
        {label: 'PDCs', href: '/disbursement/pdcs'},
        {label: 'Agency', href: '/disbursement/agency'}
      ]
    },canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisbursementRoutingModule { }
