import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundsReportComponent } from './funds-report/funds-report.component';
import { RecoveryReportComponent } from './recovery-report/recovery-report.component';
import { DisbursmentReportComponent } from './disbursment-report/disbursment-report.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatAutocompleteModule, MatRadioModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { FundManagmentToolComponent } from './fund-managment-tool/fund-managment-tool.component';
import { OrganizationTaggingReportComponent } from './organization-tagging-report/organization-tagging-report.component';
import { ProductWiseDisbursementComponent } from './product-wise-disbursement/product-wise-disbursement.component';
import { OrganizationTimeComponent } from './organization-time/organization-time.component';
import { McbRemmiDisbursementFundsComponent } from './mcb-remmi-disbursement-funds/mcb-remmi-disbursement-funds.component';
import { McbRemmiDisbursementLoaderComponent } from './mcb-remmi-disbursement-loader/mcb-remmi-disbursement-loader.component';
import { CheckDisbursementFundsComponent } from './check-disbursement-funds/check-disbursement-funds.component';
import { McbRemmiDisbursementLetterComponent } from './mcb-remmi-disbursement-letter/mcb-remmi-disbursement-letter.component';
import { EasyPaisaFundsComponent } from './easy-paisa-funds/easy-paisa-funds.component';
import { EasyPaisaLoaderComponent } from './easy-paisa-loader/easy-paisa-loader.component';
import { EasyPaisaLetterComponent } from './easy-paisa-letter/easy-paisa-letter.component';
import { ClntInfoJazzDuesComponent } from './clnt-info-jazz-dues/clnt-info-jazz-dues.component';
import { ClntUploadJazzDuesComponent } from './clnt-upload-jazz-dues/clnt-upload-jazz-dues.component';
import { EasypaisaDuesComponent } from './easypaisa-dues/easypaisa-dues.component';
import { UblOmniDuesComponent } from './ubl-omni-dues/ubl-omni-dues.component';
import { HblConnectDuesComponent } from './hbl-connect-dues/hbl-connect-dues.component';
import { AblLoanRecoveryDuesComponent } from './abl-loan-recovery-dues/abl-loan-recovery-dues.component';
import { McbCollectDuesComponent } from './mcb-collect-dues/mcb-collect-dues.component';
import { NadraDuesComponent } from './nadra-dues/nadra-dues.component';

import { DateWiseDisbComponent } from './date-wise-disb/date-wise-disb.component';
import { ChannelWiseDisbComponent } from './channel-wise-disb/channel-wise-disb.component';
import { BranchWiseDisbComponent } from './branch-wise-disb/branch-wise-disb.component';
import { ProductWiseDisbComponent } from './product-wise-disb/product-wise-disb.component';
import { BranchWiseDisbAndReversalComponent } from './branch-wise-disb-and-reversal/branch-wise-disb-and-reversal.component';
import { DateWiseRecoveryComponent } from './date-wise-recovery/date-wise-recovery.component';
import { ChannelWiseRecoveryComponent } from './channel-wise-recovery/channel-wise-recovery.component';
import { BranchWiseRecoveryComponent } from './branch-wise-recovery/branch-wise-recovery.component';
import { McbRemiMapedBrnchListComponent } from './mcb-remi-maped-brnch-list/mcb-remi-maped-brnch-list.component';
import { BankBrnchMapedListComponent } from './bank-brnch-maped-list/bank-brnch-maped-list.component';
import { DailyAdcPostedRecoveryComponent } from './daily-adc-posted-recovery/daily-adc-posted-recovery.component';
import { MobileWalletMapedComponent } from './mobile-wallet-maped/mobile-wallet-maped.component';
import { UblOmniMapedComponent } from './ubl-omni-maped/ubl-omni-maped.component';
import { TelenorCollectionComponent } from './telenor-collection/telenor-collection.component';
import { InquiriesTelenorCollectionReportComponent } from './inquiries-telenor-collection-report/inquiries-telenor-collection-report.component';
import { MobileWalletTrendComponent } from './mobile-wallet-trend/mobile-wallet-trend.component';
import { BMmobileWalletTrendComponent } from './bmmobile-wallet-trend/bmmobile-wallet-trend.component';
import { UpaisaDuesSharingComponent } from './upaisa-dues-sharing/upaisa-dues-sharing.component';
import { AtmCardsManagementComponent } from './atm-cards-management/atm-cards-management.component';
import { McbDisburseFundsStatusComponent } from '../mcb-disburse-funds-status/mcb-disburse-funds-status.component';
import { DisburseReversalRequestComponent } from '../disburse-reversal-request/disburse-reversal-request.component';
import { IbftAndIftFundsComponent } from './ibft-and-ift-funds/ibft-and-ift-funds.component';
import { ConsolidatedBankFundsComponent } from './consolidated-bank-funds/consolidated-bank-funds.component';
import { BankFundsRequestDataLoaderComponent } from './bank-funds-request-data-loader/bank-funds-request-data-loader.component';
import { KhushaliFundsLetterComponent } from './khushali-funds-letter/khushali-funds-letter.component';
import { SectorWisePortfolioComponent } from './sector-wise-portfolio/sector-wise-portfolio.component';
import { GenderWisePortfolioComponent } from './gender-wise-portfolio/gender-wise-portfolio.component';
import { AdcFailedTransactionComponent } from './adc-failed-transaction/adc-failed-transaction.component';
import { BranchWisePortfolioComponent } from './branch-wise-portfolio/branch-wise-portfolio.component';
import { ProductWisePortfolioComponent } from './product-wise-portfolio/product-wise-portfolio.component';
import { ProductWiseParComponent } from './product-wise-par/product-wise-par.component';
import { BranchWiseParComponent } from './branch-wise-par/branch-wise-par.component';
import { ProvinceWiseOstPortfolioComponent } from './province-wise-ost-portfolio/province-wise-ost-portfolio.component';
import { LoanCycleWisePortfolioComponent } from './loan-cycle-wise-portfolio/loan-cycle-wise-portfolio.component';
import { AdcDataSharingComponent } from './adc-data-sharing/adc-data-sharing.component';

export const routes: Routes = [
  { path: 'funds-report', component: FundsReportComponent },
  { path: 'recovery-report', component: RecoveryReportComponent },
  { path: 'disbursment-report', component: DisbursmentReportComponent },
  { path: 'fund-managment-tool', component: FundManagmentToolComponent },
  { path: 'organization-tagging-report', component: OrganizationTaggingReportComponent },
  { path: 'product-wise-disbursement', component: ProductWiseDisbursementComponent },
  { path: 'organization-time', component: OrganizationTimeComponent },
  { path: 'mcb-remmi-disbursement-funds', component: McbRemmiDisbursementFundsComponent },
  { path: 'mcb-remmi-disbursement-loader', component: McbRemmiDisbursementLoaderComponent },
  { path: 'mcb-remmi-disbursement-letter', component: McbRemmiDisbursementLetterComponent },
  { path: 'cheque-disbursement-funds', component: CheckDisbursementFundsComponent },
  { path: 'easy-paisa-funds', component: EasyPaisaFundsComponent },
  { path: 'easy-paisa-loader', component: EasyPaisaLoaderComponent },
  { path: 'easy-paisa-letter', component: EasyPaisaLetterComponent },
  { path: 'clnt-info-jazz-dues', component: ClntInfoJazzDuesComponent },
  { path: 'clnt-upload-jazz-dues', component: ClntUploadJazzDuesComponent },
  { path: 'easy-paisa-dues', component: EasypaisaDuesComponent },
  { path: 'ubl-omni-dues', component: UblOmniDuesComponent },
  { path: 'hbl-connect-dues', component: HblConnectDuesComponent },
  { path: 'abl-loan-recovery-dues', component: AblLoanRecoveryDuesComponent },
  { path: 'mcb-collect-dues', component: McbCollectDuesComponent },
  { path: 'nadra-dues', component: NadraDuesComponent },
  
  { path: 'date-wise-disb', component: DateWiseDisbComponent },
  { path: 'channel-wise-disb', component: ChannelWiseDisbComponent },
  { path: 'branch-wise-disb', component: BranchWiseDisbComponent },
  { path: 'product-wise-disb', component: ProductWiseDisbComponent },
  { path: 'branch-wise-reversal', component: BranchWiseDisbAndReversalComponent },
  { path: 'date-wise-recovery', component: DateWiseRecoveryComponent },
  { path: 'channel-wise-recovery', component: ChannelWiseRecoveryComponent },
  { path: 'branch-wise-recovery', component: BranchWiseRecoveryComponent },
  { path: 'daily-adc-recovery-posted', component: DailyAdcPostedRecoveryComponent },
  { path: 'mcb-remi-mapped-brnch-list', component: McbRemiMapedBrnchListComponent },
  { path: 'bank-brnchs-maped-list', component: BankBrnchMapedListComponent },
  { path: 'mapped-list-mobile-wallet', component: MobileWalletMapedComponent },
  { path: 'ubl-omni-branch-mapped-list', component:  UblOmniMapedComponent},

  // Added By Naveed - Date - 13-10-2021
  // Telenor Collection Report - SCR-EasyPaisa Integration
  { path: 'telenor-collection-report', component:  TelenorCollectionComponent},
  { path: 'Inquiriestelenor-collection-report', component:  InquiriesTelenorCollectionReportComponent},
  
  // Added By Naveed - Date - 24-02-2022 
  // SCR - Upaisa and HBL Konnect Payment Mode 
  { path: 'mobile-wallet-trend', component:  MobileWalletTrendComponent},
  { path: 'upaisa-dues-sharing', component:  UpaisaDuesSharingComponent},
  { path: 'atm-cards-management', component:  AtmCardsManagementComponent},
  // Ended By Naveed - Date - 24-02-2022

    /**
   * Added By Naveed - Date 10-05-2022
   * SCR - MCB Disbursement
   */
  { path: 'mcbDisburseFundsStatus', component: McbDisburseFundsStatusComponent },
  { path: 'disburseReversalRequest', component: DisburseReversalRequestComponent },

  /**
  * @Added, Naveed
  * @Date, 14-06-2022
  * @Description, SCR - systemization Funds Request
  */
  { path: 'ibftAndIftFunds', component: IbftAndIftFundsComponent },
  { path: 'consolidatedBankFunds', component: ConsolidatedBankFundsComponent },
  { path: 'bankFundsRequestDataLoader', component: BankFundsRequestDataLoaderComponent },
  { path: 'khushaliFundsLetter', component: KhushaliFundsLetterComponent },
  { path: 'genderWisePortfolio', component: GenderWisePortfolioComponent },
  { path: 'sectorWisePortfolio', component: SectorWisePortfolioComponent },
  { path: 'adc-failed-transaction', component: AdcFailedTransactionComponent },
  
  { path: 'branchWisePortfolio', component: BranchWisePortfolioComponent },
  { path: 'productWisePortfolio', component: ProductWisePortfolioComponent },
  { path: 'productWisePar', component: ProductWiseParComponent },
  { path: 'branchWisePar', component: BranchWiseParComponent },
  { path: 'provinceWiseOstPortfolio', component: ProvinceWiseOstPortfolioComponent },
  { path: 'loanCycleWisePortfolio', component: LoanCycleWisePortfolioComponent },
  // { path: 'kmwkClientIncome', component: KmwkClientIncomeComponent },
  // { path: 'monthlyDue', component: MonthlyDueComponent },
  // { path: 'portfolioMaturity', component: PortfolioMaturityComponent },
  // { path: 'monthlyRecovery', component: MonthlyRecoveryComponent },
  // { path: 'portfolioSizeBreakup', component: PortfolioSizeBreakupComponent },
  { path: 'adcDataSharing', component: AdcDataSharingComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,MatRadioModule,
    NgSelectModule, MatAutocompleteModule, MatInputModule, 
  ],
  declarations: [FundsReportComponent, RecoveryReportComponent, DisbursmentReportComponent, FundManagmentToolComponent, OrganizationTaggingReportComponent, ProductWiseDisbursementComponent, OrganizationTimeComponent,McbRemmiDisbursementFundsComponent, McbRemmiDisbursementLoaderComponent, CheckDisbursementFundsComponent, McbRemmiDisbursementLetterComponent, EasyPaisaFundsComponent, EasyPaisaLoaderComponent, EasyPaisaLetterComponent, ClntInfoJazzDuesComponent, ClntUploadJazzDuesComponent, EasypaisaDuesComponent, UblOmniDuesComponent, HblConnectDuesComponent, AblLoanRecoveryDuesComponent, McbCollectDuesComponent, NadraDuesComponent,
  DateWiseDisbComponent, ChannelWiseDisbComponent, BranchWiseDisbComponent, ProductWiseDisbComponent, BranchWiseDisbAndReversalComponent, DateWiseRecoveryComponent, ChannelWiseRecoveryComponent, BranchWiseRecoveryComponent, DailyAdcPostedRecoveryComponent, McbRemiMapedBrnchListComponent, BankBrnchMapedListComponent, MobileWalletMapedComponent, UblOmniMapedComponent, TelenorCollectionComponent, InquiriesTelenorCollectionReportComponent, MobileWalletTrendComponent, BMmobileWalletTrendComponent, UpaisaDuesSharingComponent, AtmCardsManagementComponent, McbDisburseFundsStatusComponent, DisburseReversalRequestComponent, IbftAndIftFundsComponent, ConsolidatedBankFundsComponent, BankFundsRequestDataLoaderComponent, KhushaliFundsLetterComponent, SectorWisePortfolioComponent, GenderWisePortfolioComponent, AdcFailedTransactionComponent, BranchWisePortfolioComponent, ProductWisePortfolioComponent, ProductWiseParComponent, BranchWiseParComponent, ProvinceWiseOstPortfolioComponent, LoanCycleWisePortfolioComponent, AdcDataSharingComponent]
})
export class FinanceModule { }
