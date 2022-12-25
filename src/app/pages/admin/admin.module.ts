import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientHealthInsuranceClaimComponent } from './client-health-insurance-claim/client-health-insurance-claim.component';
import { LeftSideBarComponent } from './admin/left-side-bar/left-side-bar.component';
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { AuthGuard } from './AuthGuard.service';
import { RescheduleComponent } from './reschedule/reschedule.component';
import { WriteOffComponent } from './write-off/write-off.component';
import { LoanServicingComponent } from './loan-servicing/loan-servicing.component';
import { ClosingComponent } from './closing/closing.component';
import { AccessRecoveryComponent } from './admin/access-recovery/access-recovery.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatSelectModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatAutocompleteModule, MatExpansionModule } from '@angular/material';
import { DataTablesModule } from 'angular-datatables';
import { AnimalDeathComponent } from './animal-death/animal-death.component';
import { JournelVoucherComponent } from './journel-voucher/journel-voucher.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AnimalInsuranceClaimComponent } from './animal-insurance-claim/animal-insurance-claim.component';
import { BranchPortfolioComponent } from './branch-portfolio/branch-portfolio.component';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DonnerTaggingComponent } from './donner-tagging/donner-tagging.component';
import { AreaAttendanceComponent } from './area-attendance/area-attendance.component';
import { NoDblClickDirective } from 'src/app/shared/directives/double-click-preventing.directive';
import { LandingComponent } from './landing/landing.component';
import { NactaManagementComponent } from './nacta-management/nacta-management.component';
import { ClientTagListComponent } from './client-tag-list/client-tag-list.component';
import { AtmCardsManagementComponent } from './atm-cards-management/atm-cards-management.component';
import { PanelHospitalComponent } from './panel-hospital/panel-hospital.component';
import { AccountsReportingComponent } from './accounts-reporting/accounts-reporting.component';
import { McbDisbursementComponent } from './mcb-disbursement/mcb-disbursement.component';
import { BypassOdComponent } from './bypass-od/bypass-od.component';
import { BranchExpenseFundsRequestComponent } from './branch-expense-funds-request/branch-expense-funds-request.component';
import { HrTrvlngExpenseComponent } from './hr-trvlng-expense/hr-trvlng-expense.component';
import { TargetOutreachComponent } from './target-outreach/target-outreach.component';
import { VechileLoansComponent } from './vechile-loans/vechile-loans.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing' }, // default route of the module
  { path: 'landing', component: LandingComponent, canActivate: [AuthGuard] },
  { path: 'transfers', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'ClientHealthInsuranceClaims', component: ClientHealthInsuranceClaimComponent, canActivate: [AuthGuard] },
  { path: 'file-upload', component: FileLoaderComponent, canActivate: [AuthGuard] },
  { path: 'reschedule', component: RescheduleComponent, canActivate: [AuthGuard] },
  { path: 'write-off', component: WriteOffComponent, canActivate: [AuthGuard] },
  { path: 'loan-servicing', component: LoanServicingComponent, canActivate: [AuthGuard] },
  { path: 'closing', component: ClosingComponent, canActivate: [AuthGuard] },
  { path: 'journel-voucher', component: JournelVoucherComponent, canActivate: [AuthGuard] },
  { path: 'attendance', component: AttendanceComponent, canActivate: [AuthGuard] },
  { path: 'area-attendance', component: AreaAttendanceComponent, canActivate: [AuthGuard] },
  { path: 'access-recoveries', component: AccessRecoveryComponent, canActivate: [AuthGuard] },
  { path: 'animal-death/:id', component: AnimalDeathComponent, canActivate: [AuthGuard] },
  { path: 'animal-insr-claim', component: AnimalInsuranceClaimComponent, canActivate: [AuthGuard] },
  { path: 'target-managment', component: BranchPortfolioComponent, canActivate: [AuthGuard] },
  { path: 'employee-assignment', component: PortfolioComponent, canActivate: [AuthGuard] },
  { path: 'donor-tagging', component: DonnerTaggingComponent, canActivate: [AuthGuard] },
  { path: 'nacta-management', component: NactaManagementComponent, canActivate: [AuthGuard] },
  // Added by Areeba - Dated 1-2-2022 - Client Tag List
  { path: 'client-tag-list', component: ClientTagListComponent, canActivate: [AuthGuard] },
  // Ended by Areeba

  // Added By Naveed - Date - 24-02-2022
  // SCR - Upaisa and HBL Konnect Payment Mode
  { path: 'atm-cards-management', component: AtmCardsManagementComponent, canActivate: [AuthGuard] },
  // Ended By Naveed 

  // Added by Areeba - Dated 24-2-2022 - Jubliee Panel Hospital List for KSZB clients
  { path: 'panel-hospital', component: PanelHospitalComponent, canActivate: [AuthGuard] },
  // Ended by Areeba

  // Added by Areeba - Dated 17-3-2022 - Monthly Accounts Reporting
  { path: 'account-reporting', component: AccountsReportingComponent, canActivate: [AuthGuard] },
  // Ended by Areeba

  /**
    * Added By Naveed - Date - 10-05-2022
    * SCR - MCB Disbursement
  */
  { path: 'mcb_disbursement', component: McbDisbursementComponent, canActivate: [AuthGuard] },
  // Ended by Naveed

  // Added by Areeba - Dated 15-04-2022 - OD Check Screen
  { path: 'od-check', component: BypassOdComponent, canActivate: [AuthGuard] },
  // Ended by Areeba

  /**
  * @Added, Naveed
  * @Date, 14-06-2022
  * @Description, SCR - systemization Funds Request
  */
  { path: 'branchExpenseFundsRequest', component: BranchExpenseFundsRequestComponent, canActivate: [AuthGuard] },
  // Added by Naveed

  // Added by Areeba - 23-06-2022 - HR Travelling
  { path: 'hr-trvlng-expense', component: HrTrvlngExpenseComponent, canActivate: [AuthGuard] },
  // Added by Naveed

  // Added by Areeba - 09-09-2022 - Target/ Outreach
  { path: 'target-outreach', component: TargetOutreachComponent, canActivate: [AuthGuard] },
  // Added by Naveed
    /**
   * @Added, Naveed
   * @Date, 14-09-2022
   * @Description, SCR - Vehicle Loan
  */
     { path: 'vehicleLoans', component: VechileLoansComponent, canActivate: [AuthGuard] },

];
@NgModule({
  imports: [
    CommonModule, MatExpansionModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule, SharedModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, MatRadioModule,
    MatSelectModule,
    DataTablesModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatMomentDateModule,
    MatCheckboxModule,
    MatAutocompleteModule
  ],
  declarations: [
    AdminComponent,
    ClientHealthInsuranceClaimComponent,
    LeftSideBarComponent,
    FileLoaderComponent,
    RescheduleComponent,
    WriteOffComponent,
    LoanServicingComponent,
    ClosingComponent,
    AccessRecoveryComponent,
    AnimalDeathComponent,
    JournelVoucherComponent,
    AttendanceComponent,
    AnimalInsuranceClaimComponent,
    BranchPortfolioComponent,
    PortfolioComponent,
    DonnerTaggingComponent,
    AreaAttendanceComponent,
    LandingComponent,
    NactaManagementComponent,
    ClientTagListComponent,
    AtmCardsManagementComponent,
    PanelHospitalComponent,
    AccountsReportingComponent,
    McbDisbursementComponent,
    BypassOdComponent,
    BranchExpenseFundsRequestComponent,
    HrTrvlngExpenseComponent,
    TargetOutreachComponent,
    VechileLoansComponent

  ],
  providers: [AuthGuard, DatePipe, { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }]

})
export class AdminModule { }
