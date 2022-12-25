import { Injectable } from '@angular/core';
import { Product } from '../models/Product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiModel } from '../models/Api.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/User.model';
import { Auth } from '../models/Auth.model';
import { LoanApplicant } from '../models/LoanApplicant.model';
import { InsuranceMember } from '../models/InsuranceMembers.model';
import { Nominee } from '../models/Nominee.model';
import { PrimaryIncome } from '../models/PrimaryIncome.model';
import { BusinessExpense } from '../models/BusinessExpense.model';
import { BusinessAppraisal } from '../models/BusinessAppraisal.model';
import { LoanUtilization } from '../models/LoanUtilization.model';
import { MFCIBLoan } from '../models/mfcib.model';
import { Question } from '../models/Question.model';
import { Community } from '../models/community.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { InsurancePlan } from '../models/InsurancePlan.model';
import { LoanProduct, LoanProductAssoc } from '../models/LoanProduct.model';
import { LOAN_BREADCRUMBS } from '../mocks/mock_common_codes';
import { Form } from '../models/Form.model';
import { History } from '../models/History.model';
import { Address } from '../models/address.model';
import { SchoolQA, SchoolQARaw, SchoolQAArray } from '../models/schoolQA.model';
import { SchoolAppraisal } from '../models/schoolAppraisal.model';
import { FormAssignment } from '../models/FormAssignment.model';
import { SchoolInformation } from '../models/SchoolInformation.model';
import { ProductGroup } from '../models/productGroup.model';
import { HilAppraisal } from '../models/hil-appraisal.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  public breadcrumbs = LOAN_BREADCRUMBS;
  apiModel: ApiModel = new ApiModel();
  auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
  token: string;
  public selfPDC: boolean;
  public sameAsFS: { firstName: string, lastName: string };
  public clientAddress: Address = new Address();
  constructor(public http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    //   if(loca)
    this.token = 'Bearer ' + sessionStorage.getItem('token');
  }

  //  VALIDATE CNIC
  validateCNCCNIC(history: History): Observable<any> {
    // console.log('SERVICE');
    // const { headers: this.apiModel.httpHeaderGet } = {
    // 	headers: new HttpHeaders({
    // 		'Authorization': this.token
    // 	})
    // };
    // return this.http.get<any>(this.apiModel.host + '/loanservice/api/get_tags_by_user_cnic/' + cnic , { headers: this.apiModel.httpHeaderGet } )
    // .pipe(tap((p: any) => console.log(p)),
    // catchError(this.handleError<any>('Validate CNIC'))
    // );
    return this.http.post<{ "client": LoanApplicant, "nominee": LoanApplicant, "coborrower": LoanApplicant }>(this.apiModel.host + '/loanservice/api/mw-tags-validation-for-clnt-nom-cob', history, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p) => console.log(p))
    );
  }
  validateCNIC(cnic: String): Observable<{ "canProceed": boolean, "reason": string, "client": LoanApplicant, "clientRel": LoanApplicant, "coborrower": LoanApplicant }> {
    return this.http.get<{ "canProceed": boolean, "reason": string, "client": LoanApplicant, "clientRel": LoanApplicant, "coborrower": LoanApplicant }>(this.apiModel.host + '/loanservice/api/mw-tags-validation-for-client/' + cnic, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((p) => console.log(p))
    );
  }


  deleteLoan(id: string) {
    return this.http.delete<LoanUtilization>(this.apiModel.host + '/loanservice/api/delete-loan-app/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: LoanUtilization) => console.log(p))
      );
  }

  createLoan(loan: LoanApplicant): Observable<LoanApplicant> {
    return this.http.post<LoanApplicant>(this.apiModel.host + '/loanservice/api/create-mw-clnt', loan, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: LoanApplicant) => console.log(`lOAN APPLICANT SUBMITTED`))
    );
  }

  savePersonalInfo(loan: LoanApplicant): Observable<LoanApplicant> {
    return this.http.put<LoanApplicant>(this.apiModel.host + '/loanservice/api/update-mw-clnt', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanApplicant) => console.log(p)
      ));
  }

  getSmhldData(clntCnic): Observable<Address> {
    return this.http.get<Address>(this.apiModel.host + '/loanservice/api/verify-smhsld-cnic/' + clntCnic, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Address) => console.log(p))
      );
  }

  updatePersonalInfo(loan: LoanApplicant): Observable<LoanApplicant> {
    return this.http.put<LoanApplicant>(this.apiModel.host + '/loanservice/api/update-mw-clnt-on-update', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanApplicant) => console.log(p)));
  }
  getProducts(loan: LoanApplicant): Observable<LoanProduct[]> {
    return this.http.post<LoanProduct[]>(this.apiModel.host + '/setupservice/api/get-products-listing-for-client', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanProduct[]) => console.log(p))
      );
  }

  onBranchSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  getProductsGroups(branchSeq): Observable<ProductGroup[]> {
    return this.http.get<ProductGroup[]>(this.apiModel.host + '/setupservice/api/mw-prd-grp-fr-brnch/' + branchSeq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: ProductGroup[]) => console.log(p))
      );
  }

  getClientHistory(loanSeq): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/loanservice/api/get-client-history-tab/' + loanSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => console.log(p))
      );
  }
  getProductBySeq(prdSeq): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-prd/' + prdSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => console.log(p))
      );
  }
  saveLoanInfo(loan: LoanApplicant): Observable<LoanApplicant> {
    return this.http.post<LoanApplicant>(this.apiModel.host + '/loanservice/api/create-client-loan-application', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanApplicant) => console.log(p))
      );
  }
  updateLoanInfo(loan: LoanApplicant): Observable<LoanApplicant> {
    return this.http.put<LoanApplicant>(this.apiModel.host + '/loanservice/api/update-loan-apps', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanApplicant) => console.log(p))
      );
  }
  getLoanApp(id: string): Observable<{ loanApp: LoanApplicant, forms: Form[] }> {
    // return this.http.get<LoanApplicant>(this.apiModel.host + '/loanservice/api/mw-loan-apps/' + id , { headers: this.apiModel.httpHeaderGet } )
    return this.http.get<{ loanApp: LoanApplicant, forms: Form[] }>(this.apiModel.host + '/loanservice/api/loan-app-by-seq/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: { loanApp: LoanApplicant, forms: Form[] }) => console.log(p)),
        catchError(this.handleError<{ loanApp: LoanApplicant, forms: Form[] }>('Get Loan App'))
      );
  }

  // MFCIB
  saveMfcibLoan(mfcibLoan: MFCIBLoan): Observable<MFCIBLoan> {
    return this.http.post<MFCIBLoan>(this.apiModel.host + '/loanservice/api/create-mfcib-oth-outsd-loans', mfcibLoan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: MFCIBLoan) => console.log(p))
      );
  }
  updateMfcibLoan(loan: MFCIBLoan): Observable<MFCIBLoan> {
    return this.http.put<MFCIBLoan>(this.apiModel.host + '/loanservice/api/update-mfcib-oth-outsd-loans', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: MFCIBLoan) => console.log(p)),
        catchError(this.handleError<MFCIBLoan>('Update MFCIB-Loan'))
      );
  }

  deleteMfcibLoan(id) {
    return this.http.delete<MFCIBLoan>(this.apiModel.host + '/loanservice/api/mw-mfcib-oth-outsd-loans/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: MFCIBLoan) => console.log(p))
      );
  }



  getMfcibLoans(id: string): Observable<MFCIBLoan[]> {
    return this.http.get<MFCIBLoan[]>(this.apiModel.host + '/loanservice/api/get-mfcib-oth-outsd-loans-by-app/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: MFCIBLoan[]) => console.log(p)),
        catchError(this.handleError<MFCIBLoan[]>('Get mfcib Loans'))
      );
  }
  saveInsuranceInfo(loan: LoanApplicant): Observable<LoanApplicant> {
    return this.http.post<LoanApplicant>(this.apiModel.host + '/loanservice/api/clnt-hlth-insr', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanApplicant) => console.log(p)),
        catchError(this.handleError<LoanApplicant>('Add Insurance-Info'))
      );
  }
  updateInsuranceInfo(loan: LoanApplicant): Observable<LoanApplicant> {
    return this.http.put<LoanApplicant>(this.apiModel.host + '/loanservice/api/update-clnt-hlth-insrs', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanApplicant) => console.log(p)),
        catchError(this.handleError<LoanApplicant>('Add Insurance-Info'))
      );
  }

  getInsurancePlans(): Observable<InsurancePlan[]> {
    return this.http.get<InsurancePlan[]>(this.apiModel.host + '/loanservice/api/get-hlth-insr-plans', { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: InsurancePlan[]) => console.log(p)),
        catchError(this.handleError<InsurancePlan[]>('Get Insurance-Plan'))
      );
  }
  getInsuranceMembers(loanAppSeq: string): Observable<InsuranceMember[]> {
    return this.http.get<InsuranceMember[]>(this.apiModel.host + '/loanservice/api/mw-clnt-hlth-members/' + loanAppSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: InsuranceMember[]) => console.log(p)),
        catchError(this.handleError<InsuranceMember[]>('Get Loan App'))
      );
  }
  getSavedInsurancePlan(loanAppSeq: string): Observable<InsuranceMember[]> {
    return this.http.get<InsuranceMember[]>(this.apiModel.host + '/loanservice/api/mw-clnt-hlth-insr/' + loanAppSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: InsuranceMember[]) => console.log(p)),
        catchError(this.handleError<InsuranceMember[]>('Get Loan App'))
      );
  }


  saveInsuranceMember(member: InsuranceMember): Observable<InsuranceMember> {
    return this.http.post<InsuranceMember>(this.apiModel.host + '/loanservice/api/create-hlth-insr-memb', member, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: InsuranceMember) => console.log(p))
      );
  }

  updateInsuranceMember(member: any): Observable<any> {
    return this.http.put<any>(this.apiModel.host + '/loanservice/api/update-hlth-insr-membs', member, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => console.log(p))
      );
  }
  deleteInsuranceMember(id: string, loanAppSeq) {
    return this.http.delete<MFCIBLoan>(this.apiModel.host + '/loanservice/api/mw-hlth-insr-membs/' + id  + '/' + loanAppSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: MFCIBLoan) => console.log(p))
      );
  }
  saveNominee(nominee: Nominee): Observable<Nominee> {
    // return this.http.post<Nominee>(this.apiModel.host + '/loanservice/api/add-client-nominee', nominee, { headers: this.apiModel.httpHeaderPost })
    // .pipe(tap((p: Nominee) => console.log(p))
    // );
    return this.http.put<Nominee>(this.apiModel.host + '/loanservice/api/save-clnt-rels', nominee, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Nominee) => console.log(p))
      );
  }
  saveCoborrower(nominee: Nominee): Observable<Nominee> {
    return this.http.post<Nominee>(this.apiModel.host + '/loanservice/api/add-application-coborrower', nominee, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Nominee) => console.log(p))
      );
  }
  getClntRel(nom: Nominee): Observable<Nominee> {
    return this.http.post<Nominee>(this.apiModel.host + '/loanservice/api/get-client-rel', nom, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Nominee) => console.log(p))
      );
  }
  saveClientRel(nominee: Nominee): Observable<Nominee> {
    return this.http.put<Nominee>(this.apiModel.host + '/loanservice/api/save-clnt-rels', nominee, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Nominee) => console.log(p))
      );
  }
  getClientRelFromPreviousLoan(nominee: Nominee): Observable<Nominee> {
    return this.http.post<Nominee>(this.apiModel.host + '/loanservice/api/get-client-rel-previous-loan', nominee, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Nominee) => console.log(p))
      );
  }
  saveStatus(id: string, flag: boolean): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/loanservice/api/update-isNomDetailAvailable/' + id + "/" + flag, { headers: this.apiModel.httpHeaderGet })
      ;
  }

  saveStatusisSAN(id: string, flag: boolean): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/loanservice/api/update-isSAN/' + id + "/" + flag, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => console.log(p))
      );
  }
  updateClientRel(nominee: Nominee): Observable<Nominee> {
    return this.http.put<Nominee>(this.apiModel.host + '/loanservice/api/update-clnt-rels', nominee, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Nominee) => console.log(p))
      );
  }
  getNominee(id: string): Observable<Nominee> {
    return this.http.get<Nominee>(this.apiModel.host + '/loanservice/api/get-nominee-of-loan-app/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: Nominee) => console.log(p)),
        catchError(this.handleError<Nominee>('Get Nominee'))
      );
  }
  getCoBorrower(id: string): Observable<Nominee> {
    return this.http.get<Nominee>(this.apiModel.host + '/loanservice/api/get-coborrower-of-loan-app/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: Nominee) => console.log(p)),
        catchError(this.handleError<Nominee>('Get Cob'))
      );
  }
  updateNominee(nominee: Nominee): Observable<Nominee> {
    return this.http.put<Nominee>(this.apiModel.host + '/loanservice/api/update-clnt-rels ', nominee, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Nominee) => console.log(p))
      );
  }

  updateCoBorrower(nominee: Nominee): Observable<Nominee> {
    return this.http.put<Nominee>(this.apiModel.host + '/loanservice/api/update-app-coborrower', nominee, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Nominee) => console.log(p))
      );
  }

  saveBusinessAppraisal(appraisal: BusinessAppraisal): Observable<BusinessAppraisal> {
    return this.http.post<BusinessAppraisal>(this.apiModel.host + '/loanservice/api/create-biz-aprsls', appraisal, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: BusinessAppraisal) => console.log(p))
      );
  }
  getBusinessAppraisal(id: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/loanservice/api/get-biz-aprsl-by-loan-app/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => console.log(p)),
        catchError(this.handleError<any>('Get Business Appraisal'))
      );
  }
  updateBusinessAppraisal(appraisal: BusinessAppraisal): Observable<BusinessAppraisal> {
    return this.http.put<BusinessAppraisal>(this.apiModel.host + '/loanservice/api/update-biz-aprsls', appraisal, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: BusinessAppraisal) => console.log(p)),
      // catchError(this.handleError<BusinessAppraisal>('Add Business Appraisal'))
    );
  }
  getBusinessActyForActySeq(id: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-biz-acty-by-acty-seq/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => console.log(p)),
        catchError(this.handleError<any>('Get Business Acty For Sect Seq'))
      );
  }
  saveIncome(income: PrimaryIncome): Observable<PrimaryIncome> {
    return this.http.post<PrimaryIncome>(this.apiModel.host + '/loanservice/api/mw-biz-aprsl-incm-dtls', income, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: PrimaryIncome) => console.log(p)),
        catchError(this.handleError<PrimaryIncome>('Add Income'))
      );
  }

  saveExpense(expense: BusinessExpense): Observable<BusinessExpense> {
    console.log("EXPENSE")
    return this.http.post<BusinessExpense>(this.apiModel.host + '/loanservice/api/create-business-expense', expense, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: BusinessExpense) => console.log(p)),
        catchError(this.handleError<BusinessExpense>('Add Expense'))
      );
  }

  getAllLoanInfo(userId: string, role: string): Observable<LoanApplicant[]> {
    return this.http.get<LoanApplicant[]>(this.apiModel.host + '/loanservice/api/get-clients-listing-for-user/' + userId + '/' + role, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: LoanApplicant[]) => console.log(p)),
        catchError(this.handleError<LoanApplicant[]>('Get Loan Applicants'))
      );
  }

  getAllLoanInfoPaged(userId: string, role: string, pagedIndex, pageSize, sort, direction, filterString, brnchSeq): Observable<{ "loans": LoanApplicant[], "count": number, "pageNumber": number }> {
    return this.http.get<LoanApplicant[]>(this.apiModel.host + '/loanservice/api/get-clients-listing-for-user?user=' + userId + '&role=' + role + '&filter=' + filterString + '&sort=' + sort + '&direction=' + direction + '&pageIndex=' + pagedIndex + '&pageSize=' + pageSize + '&brnchSeq=' + (brnchSeq == null ? '' : brnchSeq), { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: { "loans": LoanApplicant[], "count": Number, "pageNumber": Number }) => console.log(p)),
        catchError(this.handleError<{ "loans": LoanApplicant[], "count": Number, "pageNumber": Number }>('Get Loan Applicants'))
      );
  }

  getAllDocumentsForLoanApp(seq: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/loanservice/api//mw-loan-app-docs-for-loan-app/' + seq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any[]) => console.log(p)),
        catchError(this.handleError<any[]>('Get Loan Applicant\'s Documents'))
      );
  }


  getAllLoanInfoFiltered(filter: any): Observable<LoanApplicant[]> {
    return this.http.post<LoanApplicant[]>(this.apiModel.host + '/loanservice/api/get-clients-listing-for-user', filter, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanApplicant[]) => console.log(p))
      );
  }
  getLoanInfo(id: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/loanservice/api/mw-clnts/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => console.log(p)),
        catchError(this.handleError<any>('Get Loan Applicant :  ' + id))
      );
  }

  getClientLoanInfo(id: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/loanservice/api/mw-clnts-loans/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => console.log(p)),
        catchError(this.handleError<any>('Get Loan Applicant :  ' + id))
      );
  }

  getLocations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/loanservice/api/get-address-combinations', { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any[]) => console.log(p)),
        catchError(this.handleError<any[]>('Get Address'))
      );

  }

  getLocationsForPort(portSeq): Observable<any[]> {
    return this.http.get<any[]>(this.apiModel.host + '/loanservice/api/get-address-combinations/' + portSeq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any[]) => console.log(p)),
        catchError(this.handleError<any[]>('Get Address'))
      );

  }

  addExpenseLoan(loan: LoanUtilization): Observable<LoanUtilization> {
    return this.http.post<LoanUtilization>(this.apiModel.host + '/loanservice/api/mw-loan-utl-plans', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanUtilization) => console.log(p)),
      // catchError(this.handleError<LoanUtilization>('Add Loan Utilization'))
    );
  }
  getExpenseLoanInfo(id: string): Observable<any> {
    return this.http.get<LoanApplicant>(this.apiModel.host + '/loanservice/api/get-loan-utl-plans-by-loan-app/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: LoanApplicant) => console.log(p)),
        catchError(this.handleError<LoanApplicant>('Get getExpenseLoanInfo:  ' + id))
      );
  }
  updateExpenseLoan(loan: LoanUtilization): Observable<LoanUtilization> {
    return this.http.put<LoanUtilization>(this.apiModel.host + '/loanservice/api/update-loan-utl-plans', loan, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanUtilization) => console.log(p)),
      // catchError(this.handleError<LoanUtilization>('update Loan Utilization'))
    );
  }
  deleteExpectedLoanUtil(id: string) {
    return this.http.delete<LoanUtilization>(this.apiModel.host + '/loanservice/api/delete-loan-utl-plans/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: LoanUtilization) => console.log(p))
      );
  }

  getQuestionAndAnswer(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiModel.host + '/loanservice/api/get-qst-answr-list', { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: Question[]) => console.log(p)),
      // catchError(this.handleError<Question[]>('Get Question & Answers'))
    );
  }

  savePSC(questions: Question[]): Observable<Question[]> {
    return this.http.post<Question[]>(this.apiModel.host + '/loanservice/api/add-clnt-pscs', questions, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: Question[]) => console.log(p))
      );
  }

  getPSC(id: string): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiModel.host + '/loanservice/api/get-user-qst-answrs/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: Question[]) => console.log(p)),
      // catchError(this.handleError<Question[]>('Get Questions to Edit'))
    );
  }

  getCommunity(): Observable<Community[]> {
    return this.http.get<Community[]>(this.apiModel.host + '/loanservice/api/get-employee-cmnties', { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: Community[]) => console.log(p)),
        catchError(this.handleError<Community[]>('Get Community'))
      );
  }

  getLoanAppForSubmit(id: string): Observable<{ loanApp: LoanApplicant, forms: Form[], clntInfo: LoanApplicant, BusinessIncome: BusinessAppraisal, BusinessApraisal: BusinessAppraisal, locationInfo: any }> {
    return this.http.get<{ loanApp: LoanApplicant, forms: Form[], clntInfo: LoanApplicant, BusinessIncome: BusinessAppraisal, BusinessApraisal: BusinessAppraisal, locationInfo: any }>(this.apiModel.host + '/loanservice/api/loan-app-submit/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p => console.log(p))
      ));
  }

  submitApp(loanApp: LoanApplicant) {
    return this.http.post(this.apiModel.host + '/loanservice/api/submit-loan-application', loanApp, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => console.log(p))
      );
  }
 // Modified By Naveed - Date - 24-02-2022
  // KSK show Message 
  submitAssocLoanApp(loanApp: LoanProductAssoc) {
    return this.http.post(this.apiModel.host + '/loanservice/api/submit-loan-associate-application', loanApp, { headers: this.apiModel.httpHeaderPost });
  } // endd by Naveed
  approveApp(loanApp: LoanApplicant): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/loanservice/api/approve-loan-application', loanApp, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => console.log(p))
      );
  }

  sendbackApp(loanApp: LoanApplicant): Observable<LoanApplicant> {
    return this.http.post<LoanApplicant>(this.apiModel.host + '/loanservice/api/send-back-loan-application', loanApp, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanApplicant) => console.log(p))
      );
  }

  rejectApplication(loanApp: LoanApplicant): Observable<LoanApplicant> {
    return this.http.post<LoanApplicant>(this.apiModel.host + '/loanservice/api/reject-loan-application', loanApp, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: LoanApplicant) => console.log(p))
      );
  }
  getPaymentSchedule(loanAppSeq: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/recoverydisbursementservice/api/expected-payment-schedule/' + loanAppSeq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => console.log(p))
      );
  }
  getSchoolQAs(): Observable<SchoolQARaw[]> {
    // return this.http.get<SchoolQARaw[]>(this.apiModel.host + '/api/get-qst-list/' + 204 , this.apiModel.{ headers: this.apiModel.httpHeaderGet } )
    return this.http.get<SchoolQARaw[]>(this.apiModel.host + '/loanservice/api/get-qst-list/203', { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: SchoolQARaw[]) => console.log(p)),
      // catchError(this.handleError<Question[]>('getSchoolQAs'))
    );
  }
  getSchoolByQstnrSeq(seq): Observable<SchoolQAArray[]> {
    // return this.http.get<SchoolQARaw[]>(this.apiModel.host + '/api/get-qst-list/' + 204 , this.apiModel.{ headers: this.apiModel.httpHeaderGet } )
    return this.http.get<SchoolQAArray[]>(this.apiModel.host + '/loanservice/api/get-qst-list-by-type/' + seq, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: SchoolQAArray[]) => console.log(p)),
      // catchError(this.handleError<Question[]>('getSchoolQAs'))
    );
  }
  getSchoolApperaisal(loanAppSeq): Observable<SchoolAppraisal> {
    // return this.http.get<SchoolQARaw[]>(this.apiModel.host + '/api/get-qst-list/' + 204 , this.apiModel.{ headers: this.apiModel.httpHeaderGet } )
    return this.http.get<SchoolAppraisal>(this.apiModel.host + '/loanservice/api/mw-sch-aprsl/' + loanAppSeq,
      { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: SchoolAppraisal) => console.log(p)),
      // catchError(this.handleError<SchoolAppraisal>('getSchoolApperaisal'))
    );
  }

  getSchoolInformation(loanAppSeq): Observable<SchoolInformation> {
    // return this.http.get<SchoolQARaw[]>(this.apiModel.host + '/api/get-qst-list/' + 204 , this.apiModel.{ headers: this.apiModel.httpHeaderGet } )
    return this.http.get<SchoolInformation>(this.apiModel.host + '/loanservice/api/mw-sch-asts/' + loanAppSeq,
      { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: SchoolInformation) => console.log(p)),
      // catchError(this.handleError<SchoolAppraisal>('getSchoolApperaisal'))
    );
  }
  addSchoolAppraisal(school: SchoolAppraisal): Observable<{ SchoolAppraisalDto: SchoolAppraisal }> {
    // return this.http.post<SchoolAppraisal>(this.apiModel.host + '/add-new-sch-aprsl', school, { headers: this.apiModel.httpHeaderPost })
    return this.http.post<{ SchoolAppraisalDto: SchoolAppraisal }>(this.apiModel.host + '/loanservice/api/add-new-sch-aprsl', school, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: { SchoolAppraisalDto: SchoolAppraisal }) => console.log(p)),
      // catchError(this.handleError<SchoolAppraisal>('addSchoolAppraisal'))
    );
  }
  addSchoolInformation(school: SchoolInformation): Observable<{ schoolInformationDto: SchoolInformation }> {
    return this.http.post<{ schoolInformationDto: SchoolInformation }>(this.apiModel.host + '/loanservice/api/add-new-sch-asts', school, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: { schoolInformationDto: SchoolInformation }) => console.log(p)),
    );
  }
  updateSchoolAppraisal(school: SchoolAppraisal): Observable<{ SchoolAppraisalDto: SchoolAppraisal }> {
    // return this.http.post<SchoolAppraisal>(this.apiModel.host + '/update-sch-aprsl', school, { headers: this.apiModel.httpHeaderPost })
    return this.http.put<{ SchoolAppraisalDto: SchoolAppraisal }>(this.apiModel.host + '/loanservice/api/update-sch-aprsl', school, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: { SchoolAppraisalDto: SchoolAppraisal }) => console.log(p)),
      // catchError(this.handleError<SchoolAppraisal>('updateSchoolAppraisal'))
    );
  }

  getAllFormsAssignments() {
    return this.http.get<FormAssignment>
      (this.apiModel.host + '/setupservice/api/mw-form/', { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('getAllFormsAssignments')));
  }

  getAllFormsAssignmentsBySeq(seq) {
    return this.http.get<FormAssignment>
      (this.apiModel.host + '/setupservice/api/mw-prd-form-rel-by-prd-seq/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('getAllFormsAssignmentsBySeq')));
  }

  getMwPrdBySeq(seq) {
    return this.http.get<FormAssignment>
      (this.apiModel.host + '/setupservice/api/mw-prd/' + seq, { headers: this.apiModel.httpHeaderGet }).pipe(
        tap((data: any) => console.log(data)),
        catchError(this.handleError('getMwPrdBySeq')));
  }

// Added By Naveed - Dated - 24-11-2021
// Operation - SCR System Control
  deleteApplication(loanAppSeq:any, cmnt: any): any {
    const url = this.apiModel.host + '/recoverydisbursementservice/api/delete-application/' + loanAppSeq + '/' + cmnt;
    return this.http.get(url, { headers: this.apiModel.httpHeaderGet }).pipe(
      tap((data: any) => this.toastr.success('Application Deleted.', 'Success!')),
      catchError(this.handleError('deleteApplication')));
  }
  // Added By Naveed - Dated - 24-11-2021

  // Added By Areeba - Dated - 10-05-2022 - Home Loan
  saveHilAppraisal(appraisal: HilAppraisal): Observable<HilAppraisal> {
    return this.http.post<HilAppraisal>(this.apiModel.host + '/loanservice/api/add-new-hm-aprsl', appraisal, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: HilAppraisal) => console.log(p))
      );
  }
  getHilAppraisal(id: string): Observable<any> {
    return this.http.get<any>(this.apiModel.host + '/loanservice/api/mw-hm-aprsl/' + id, { headers: this.apiModel.httpHeaderGet })
      .pipe(tap((p: any) => console.log(p)),
        catchError(this.handleError<any>('Get Hil Appraisal'))
      );
  }
  updateHilAppraisal(appraisal: HilAppraisal): Observable<HilAppraisal> {
    return this.http.put<HilAppraisal>(this.apiModel.host + '/loanservice/api/update-hm-aprsl', appraisal, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: HilAppraisal) => console.log(p)),
       catchError(this.handleError<HilAppraisal>('Add Hil Appraisal'))
    );
  }
  addDocumentToLoanApp(img: string, seq: string): Observable<any> {
    return this.http.put<any>(this.apiModel.host + '/loanservice/api/add-mw-loan-app-doc/' + seq, img, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => console.log(p)),
        catchError(this.handleError<any>('Post Halaf Nama'))
      );
  }
  // Ended by Areeba
  public handleError<T>(operation = 'operation', result?: T) {

    return (error: any): Observable<T> => {
      this.spinner.hide();
      if (error.status === 400) {
        this.toastr.error(error.error.error, 'Warning!');
      } else if (error.status === 500) {
        this.toastr.error('Internal Server Error', 'Error!');
      } else {
        this.toastr.error(error.error.error, 'Error!');
      }

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  //pagenation service
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
}
