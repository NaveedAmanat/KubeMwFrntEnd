import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OverdueloansReportComponent } from './overdueloans-report/overdueloans-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsLeftsideBarComponent } from './reports-leftside-bar/reports-leftside-bar.component';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatRadioButton, MatExpansionModule, MatRadioModule } from '@angular/material';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { FundStmntComponent } from './fund-stmnt/fund-stmnt.component';
import { ValidationReportComponent } from './validation-report/validation-report.component';
import { AccountLedgerComponent } from './account-ledger/account-ledger.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { DueRecoveryComponent } from './due-recovery/due-recovery.component';
import { WomenparticipationComponent } from './womenparticipation/womenparticipation.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PartyLedgerComponent } from './party-ledger/party-ledger.component';
import { ProjectedClientsLoanCompletionComponent } from './projected-clients-loan-completion/projected-clients-loan-completion.component';
import { BrnchTurnoverAnlysisComponent } from './brnch-turnover-anlysis/brnch-turnover-anlysis.component';
import { InsuranceClaimComponent } from './insurance-claim/insurance-claim.component';
import { PARBranchWiseComponent } from './par-branch-wise/par-branch-wise.component';
import { BranchPerformanceReviewComponent } from './branch-performance-review/branch-performance-review.component';
import { FiveDayAdvanceComponent } from './five-day-advance/five-day-advance.component';
import { TopSheetComponent } from './top-sheet/top-sheet.component';
import { RateOfRetentionComponent } from './rate-of-retention/rate-of-retention.component';
import { PdcDetailComponent } from './pdc-detail/pdc-detail.component';
import { ProductWiseReportEditionComponent } from './product-wise-report-edition/product-wise-report-edition.component';
import { AdcWiseBranchRecoveryComponent } from './adc-wise-branch-recovery/adc-wise-branch-recovery.component';
import { PortfolioConcentrationComponent } from './portfolio-concentration/portfolio-concentration.component';
import { PendingClientsComponent } from './pending-clients/pending-clients.component';
import { TagClientClaimComponent } from './tag-client-claim/tag-client-claim.component';
import { AgenciesTargetTrackingComponent } from './agencies-target-tracking/agencies-target-tracking.component';
import { TransferredClientsComponent } from './transferred-clients/transferred-clients.component';
import { AuthGuard } from './AuthGuard.service';
import { TurnAroundTimeComponent } from './turn-around-time/turn-around-time.component';
import { FemaleParticipationComponent } from './female-participation/female-participation.component';
import { SharedComponent } from './shared/shared.component';
import { PortfolioStatusComponent } from './operations/portfolio-status/portfolio-status.component';
import { ReversedEntriesComponent } from './reversed-entries/reversed-entries.component';
import { TrailBalanceComponent } from './trail-balance/trail-balance.component';
import { ParMdComponent } from './par-md/par-md.component';
import { LandingComponent } from './landing/landing.component';
import { BmBdoRecoveryComponent } from './bm-bdo-recovery/bm-bdo-recovery.component';
//import { ClientHealthBeneficiaryComponent } from './client-health-beneficiary/client-health-beneficiary.component';
import { ActiveClientsComponent } from './active-clients/active-clients.component';
import { MobileWalletDisbursmentComponent } from './mobile-wallet-disbursment/mobile-wallet-disbursment.component';
import { MobileWalletDisbursmentDueComponent } from './mobile-wallet-disbursment-due/mobile-wallet-disbursment-due.component';
import { ClientsLoanMaturityComponent } from './clients-loan-maturity/clients-loan-maturity.component';
import { PortfolioNewComponent } from './portfolio-new/portfolio-new.component';
import { DonorTaggingReportComponent } from './donor-tagging-report/donor-tagging-report.component';
import { VerisysReportComponent } from './verisys-report/verisys-report.component';
import { AnimalMissingTagComponent } from './animal-missing-tag/animal-missing-tag.component';
import { KmPortfolioComponent } from './km-portfolio/km-portfolio.component';
import { RecoveryTrendAnalysisComponent } from './recovery-trend-analysis/recovery-trend-analysis.component';
import { BmClientsLoanMaturityComponent } from './bm-clients-loan-maturity/bm-clients-loan-maturity.component';
import { BmMobileWalletDisbursmentComponent } from './bm-mobile-wallet-disbursment/bm-mobile-wallet-disbursment.component';
import { BmMobileWalletDisbursmentDueComponent } from './bm-mobile-wallet-disbursment-due/bm-mobile-wallet-disbursment-due.component';
import { MobileWalletOpenedComponent } from './finance/mobile-wallet-opened/mobile-wallet-opened.component';
import { TransferClientsDetailsComponent } from './finance/transfer-clients-details/transfer-clients-details.component';
import { RegionalRiskFlaggingReportComponent } from './regional-risk-flagging-report/regional-risk-flagging-report.component';
import { RiskAndSocialKpiComponent } from './risk-and-social-kpi/risk-and-social-kpi.component';
import { RegionDisbursementComponent } from './region-disbursement/region-disbursement.component';
import { TopSheetTransferClientsComponent } from './top-sheet-transfer-clients/top-sheet-transfer-clients.component';
import { PremiumDataComponent } from './premium-data/premium-data.component';
import { PremiumDataKmComponent } from './premium-data-km/premium-data-km.component';
import { WoRecoveryComponent } from './wo-recovery/wo-recovery.component';
import { WoClientDataComponent } from './wo-client-data/wo-client-data.component';
import { AccRecoveryComponent } from './acc-recovery/acc-recovery.component';
import { ClientDataComponent } from './client-data/client-data.component';
import { KszbClientDataComponent } from './kszb-client-data/kszb-client-data.component';
import { AccTopsheetComponent } from './acc-topsheet/acc-topsheet.component';
import { AccRecoverydetailComponent } from './acc-recoverydetail/acc-recoverydetail.component';
import { RegionalRecoveryTrendComponent } from './regional-recovery-trend/regional-recovery-trend.component';
import { NadraVerisysErrorStatusComponent } from './nadra-verisys-error-status/nadra-verisys-error-status.component';
import { ExportBankBookCsvComponent } from './export-bank-book-csv/export-bank-book-csv.component';
import { MonthlyAccountsComponent } from './monthly-accounts/monthly-accounts.component';
// import { InsuranceReportsComponent } from './insurance-reports/insurance-reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', canActivate: [AuthGuard] }, // default route of the module
  { path: 'landing', component: LandingComponent, canActivate: [AuthGuard]},
  { path: 'overdue', component: OverdueloansReportComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioComponent, canActivate: [AuthGuard] },
  { path: 'fund-stmnt', component: FundStmntComponent, canActivate: [AuthGuard] },
  { path: 'validation', component: ValidationReportComponent, canActivate: [AuthGuard] },
  { path: 'accounts-ledger', component: AccountLedgerComponent, canActivate: [AuthGuard] },
  { path: 'book-details', component: BookDetailsComponent, canActivate: [AuthGuard] },
  { path: 'due-recovery', component: DueRecoveryComponent, canActivate: [AuthGuard] },
  { path: 'women-participation', component: WomenparticipationComponent, canActivate: [AuthGuard] },
  { path: 'party-ledger', component: PartyLedgerComponent, canActivate: [AuthGuard] },
 // { path: 'client-health-beneficiary', component: ClientHealthBeneficiaryComponent, canActivate: [AuthGuard] },
  { path: 'brnch-turnover-anlysis', component: BrnchTurnoverAnlysisComponent, canActivate: [AuthGuard] },
  { path: 'insurance-claim', component: InsuranceClaimComponent, canActivate: [AuthGuard] },
  { path: 'par-branch-wise', component: PARBranchWiseComponent, canActivate: [AuthGuard] },
  { path: 'branch-performance-review', component: BranchPerformanceReviewComponent, canActivate: [AuthGuard] },
  { path: 'five-days-advance-recovery', component: FiveDayAdvanceComponent, canActivate: [AuthGuard] },
  { path: 'top-sheet', component: TopSheetComponent, canActivate: [AuthGuard] },
  { path: 'rate-of-retention', component: RateOfRetentionComponent, canActivate: [AuthGuard] },
  { path: 'pdc-detail', component: PdcDetailComponent, canActivate: [AuthGuard] },
  { path: 'product-wise-report-edition', component: ProductWiseReportEditionComponent, canActivate: [AuthGuard] },
  { path: 'projected-clients-loan-completeion', component: ProjectedClientsLoanCompletionComponent, canActivate: [AuthGuard] },
  { path: 'par-branch-wise-report', component: PARBranchWiseComponent, canActivate: [AuthGuard] },
  { path: 'adc-wise-branch-recovery', component: AdcWiseBranchRecoveryComponent, canActivate: [AuthGuard] },
  { path: 'portfolio-concentration', component: PortfolioConcentrationComponent, canActivate: [AuthGuard] },
  { path: 'pending-clients', component: PendingClientsComponent, canActivate: [AuthGuard] },
  { path: 'tagged-client-claim', component: TagClientClaimComponent, canActivate: [AuthGuard] },
  { path: 'agencies-target-tracking', component: AgenciesTargetTrackingComponent, canActivate: [AuthGuard] },
  { path: 'transferred-clients', component: TransferredClientsComponent, canActivate: [AuthGuard] },
  { path: 'turn-around-time', component: TurnAroundTimeComponent, canActivate: [AuthGuard] },
  { path: 'female-participation', component: FemaleParticipationComponent, canActivate: [AuthGuard] },
  { path: 'reversed-enteries', component: ReversedEntriesComponent, canActivate: [AuthGuard] },
  { path: 'trail-balance', component: TrailBalanceComponent, canActivate: [AuthGuard] },
  { path: 'md-par', component: ParMdComponent, canActivate: [AuthGuard] },
  { path: 'bm-bdo-recovery', component: BmBdoRecoveryComponent, canActivate: [AuthGuard] },
  { path: 'active-clients', component: ActiveClientsComponent, canActivate: [AuthGuard] },
  { path: 'mobile-wallet-dis', component: MobileWalletDisbursmentComponent, canActivate: [AuthGuard] },
  { path: 'mobileWallet-dues', component: MobileWalletDisbursmentDueComponent, canActivate: [AuthGuard] },
  { path: 'maturity-loanClients', component: ClientsLoanMaturityComponent, canActivate: [AuthGuard] },
  { path: 'donor-tagging-report', component: DonorTaggingReportComponent, canActivate: [AuthGuard] },
  { path: 'verisys-report', component: VerisysReportComponent, canActivate: [AuthGuard] },
  { path: 'missing-animial-tag', component: AnimalMissingTagComponent, canActivate: [AuthGuard] },
  { path: 'km-portfolio', component: KmPortfolioComponent, canActivate: [AuthGuard] },
  { path: 'recover-trend-analysis', component: RecoveryTrendAnalysisComponent, canActivate: [AuthGuard] },
  { path: 'bm-mobile-wallet-dis', component: BmMobileWalletDisbursmentComponent, canActivate: [AuthGuard] },
  { path: 'bm-mobileWallet-dues', component: BmMobileWalletDisbursmentDueComponent, canActivate: [AuthGuard] },
  { path: 'bm-maturity-loanClients', component: BmClientsLoanMaturityComponent, canActivate: [AuthGuard] },
  // Added By Areeba- Date 23-01-2022
  // SCR Mobile wallet control 
  { path: 'mobile-wallet-opened', component: MobileWalletOpenedComponent, canActivate: [AuthGuard] },
  // SCR Portfolio transfer
  { path: 'transfer-clients-details', component:  TransferClientsDetailsComponent},
  // Ended By Areeba- Date 23-01-2022
  
  // Added By Areeba - Date - 25-1-2022
  // Top Sheet Transfer Clients Report
  { path: 'topsheet-transfer-clients', component:  TopSheetTransferClientsComponent},

  // SCR RM Reports Date 25-01-2022
  { path: 'regional-risk-flaggingReport', component:  RegionalRiskFlaggingReportComponent},
  { path: 'riskand-social-kpi', component:  RiskAndSocialKpiComponent},
  { path: 'region-disbursements', component:  RegionDisbursementComponent},
  { path: 'regionalRcvryTrend', component:  RegionalRecoveryTrendComponent},
  // Ended By Naveed - Date 25-01-2022
  
    // Added By Areeba- Date 15-02-2022 - Accounts Reports
    { path: 'prem-data', component:  PremiumDataComponent},
    { path: 'premium-data-km', component:  PremiumDataKmComponent},
    { path: 'wo-recovery', component:  WoRecoveryComponent},
    { path: 'wo-client-data', component:  WoClientDataComponent},
    { path: 'acc-recovery', component: AccRecoveryComponent},
    { path: 'clnt-data', component: ClientDataComponent},
    { path: 'kszb-clnt-data', component: KszbClientDataComponent},
    { path: 'acc-topsheet', component: AccTopsheetComponent},
    { path: 'acc-recvry-detail', component: AccRecoverydetailComponent},
    { path: 'monthly-accounts', component: MonthlyAccountsComponent},
    // { path: 'insurance-reports', component: InsuranceReportsComponent},
    //Ended by Areeba
    
  {
    path: 'operations',
    component: SharedComponent,
    loadChildren: './operations/operations.module#OperationsModule'
  },
  {
    path: 'finance',
    component: SharedComponent,
    loadChildren: './finance/finance.module#FinanceModule'
  },
  {
    path: 'operational-reports',
    component: SharedComponent,
    loadChildren: './operational-reports/operational-reports.module#OperationalReportsModule'
  },
  {
    path: 'rescheduling-reports',
    component: SharedComponent,
    loadChildren: './rescheduling-reports/rescheduling-reports.module#ReschedulingReportsModule'
  },
  {
    path: 'compliance-repot',
    component: SharedComponent,
    loadChildren: './compliance-repot/compliance-repot.module#ComplianceRepotModule'
  },
  // Added By Areeba- Date 30-03-2022 - Audit Reports
  {
    path: 'audit-report',
    component: SharedComponent,
    loadChildren: './audit-report/audit-report.module#AuditReportModule'
  },
  //Ended by Areeba
  { path: 'new-portfoliomonitoring', component: PortfolioNewComponent, canActivate: [AuthGuard] },

  { path: 'nadraVerisysStatus', component: NadraVerisysErrorStatusComponent, canActivate: [AuthGuard] },
  { path: 'exportBankBookCsv', component: ExportBankBookCsvComponent, canActivate: [AuthGuard] }
];
@NgModule({
  imports: [
    CommonModule, MatAutocompleteModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule, 
    SharedModule, 
    MatSelectModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    NgSelectModule,
    MatExpansionModule,
    MatRadioModule
  ],
  declarations: [OverdueloansReportComponent, ReportsLeftsideBarComponent, PortfolioComponent, FundStmntComponent, ValidationReportComponent, AccountLedgerComponent, BookDetailsComponent, DueRecoveryComponent, WomenparticipationComponent, PartyLedgerComponent, BrnchTurnoverAnlysisComponent, InsuranceClaimComponent, PARBranchWiseComponent, BranchPerformanceReviewComponent, FiveDayAdvanceComponent, ProjectedClientsLoanCompletionComponent, TopSheetComponent, PdcDetailComponent, RateOfRetentionComponent, PdcDetailComponent, ProductWiseReportEditionComponent, PARBranchWiseComponent, AdcWiseBranchRecoveryComponent, PortfolioConcentrationComponent, PendingClientsComponent, TagClientClaimComponent, AgenciesTargetTrackingComponent, TransferredClientsComponent, TurnAroundTimeComponent, FemaleParticipationComponent, SharedComponent, ReversedEntriesComponent, TrailBalanceComponent, ParMdComponent, LandingComponent, BmBdoRecoveryComponent
  , ActiveClientsComponent, MobileWalletDisbursmentComponent, MobileWalletDisbursmentDueComponent, ClientsLoanMaturityComponent, PortfolioNewComponent, DonorTaggingReportComponent, VerisysReportComponent, AnimalMissingTagComponent, KmPortfolioComponent, RecoveryTrendAnalysisComponent, BmMobileWalletDisbursmentComponent, BmMobileWalletDisbursmentDueComponent, BmClientsLoanMaturityComponent, MobileWalletOpenedComponent, TransferClientsDetailsComponent, RegionalRiskFlaggingReportComponent, RiskAndSocialKpiComponent, RegionDisbursementComponent, TopSheetTransferClientsComponent, PremiumDataComponent, PremiumDataKmComponent, WoRecoveryComponent, WoClientDataComponent, AccRecoveryComponent, ClientDataComponent, KszbClientDataComponent, AccTopsheetComponent, AccRecoverydetailComponent, RegionalRecoveryTrendComponent, NadraVerisysErrorStatusComponent, ExportBankBookCsvComponent, MonthlyAccountsComponent],
  providers: [AuthGuard],
})
export class ReportModule { }
