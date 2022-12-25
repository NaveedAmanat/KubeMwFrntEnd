import {Injectable} from '@angular/core';
import {Product} from '../models/Product.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiModel} from '../models/Api.model';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';;
import {ToastrService} from 'ngx-toastr';
import {LoanTerms, PrincipleAmount, Segregate, SegregateBody} from '../models/principleAmount.model';
import {AdvanceRules, ProductRules} from '../models/productRules.model';
import {ProductGroup} from '../models/productGroup.model';
import {ProductCharges} from '../models/productCharges.model';
import {
  AccountingSetup,
  AdjustmnentSequence,
  BusinessSector,
  FormAssignment,
  FormAssignmentBody, ProductDocuments, AsocProduct
} from '../models/FormAssignment.model';
import { Auth } from '../models/Auth.model';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  auth:Auth=JSON.parse(sessionStorage.getItem('auth'));
  apiModel: ApiModel = new ApiModel();
  product: Product;
  constructor(public http: HttpClient,
              private router: Router,
              private toastr: ToastrService) {
    console.log('Product Service Initiated');
  }
  public updateCurrentProduct(p: Product) {
    this.product = p;
  }
  addAdjustmentSequence(disb: AdjustmnentSequence): Observable<{PrdChrgAdjOrdr:AdjustmnentSequence}> {
    console.log(disb);
    return this.http.post<{PrdChrgAdjOrdr:AdjustmnentSequence}>(this.apiModel.host + '/setupservice/api/add-new-prd-chrg-adj-ordr' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addAdjustmentSequence'))
    ));
  }

  deleteAdjustmentSequence(seq): Observable<FormAssignmentBody> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-chrg-adj-ordr/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        // this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deleteFormAssignment')));
  }

  addProductGroup(disb: ProductGroup): Observable<ProductGroup> {
    console.log(disb);
    return this.http.post<ProductGroup>(this.apiModel.host + '/setupservice/api/add-new-prd-grp' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addProductGroup'))
    ));
  }

  
  
  addFormAssignment(disb: FormAssignmentBody): Observable<{PrdFormRel:FormAssignmentBody}> {
    console.log(disb);
    return this.http.post<{PrdFormRel:FormAssignmentBody}>(this.apiModel.host + '/setupservice/api/add-new-prd-form-rel' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        // this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addFormAssignment'))
    ));
  }
  getAllAsocProductRel(prdSeq): Observable<AsocProduct[]>{
    return this.http.get<AsocProduct[]>
    (this.apiModel.host + '/setupservice/api/get-asoc-prd-rel/' + prdSeq , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: AsocProduct[]) => console.log(data))
    );
  }
  addAssocProductAssignment(prdRel:AsocProduct): Observable<{rel:AsocProduct}> {
    return this.http.post<{rel:AsocProduct}>(this.apiModel.host + '/setupservice/api/add-new-asoc-prd-rel' ,
      prdRel, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p:{rel:AsocProduct}) => {
        console.log(p);
      })
    );
  }
  deleteAssocProductAssignment(seq): Observable<AsocProduct> {
    const url = this.apiModel.host + '/setupservice/api/mw-asoc-prd-rel/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: AsocProduct) => {
        console.log(p);
      })
    );
  }
  addBusinessSector(disb: BusinessSector): Observable<{PrdBizSectRel:BusinessSector}> {
    console.log(disb);
    return this.http.post<{PrdBizSectRel:BusinessSector}>(this.apiModel.host + '/setupservice/api/add-new-prd-biz-sect-rel' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        // this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addBusinessSector'))
    ));
  }
  addProduct(disb: Product): Observable<{Product:Product}> {
    console.log(disb);
    return this.http.post<{Product:Product}>(this.apiModel.host + '/setupservice/api/add-new-prd' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: {Product:Product}) => {
        console.log(p);
        this.toastr.success('added successfully', 'Success');
      })
    );
  }
  addPrincipleAmount(disb: PrincipleAmount): Observable<PrincipleAmount> {
    console.log(disb);
    return this.http.post<PrincipleAmount>(this.apiModel.host + '/setupservice/api/add-new-prd-ppal-lmt' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: PrincipleAmount) => {
        console.log(p);
        this.toastr.success('added successfully', 'Success');
      })
    );
  }
  addCharges(disb: ProductCharges): Observable<{PrdChrg:ProductCharges}> {
    console.log(disb);
    return this.http.post<{PrdChrg:ProductCharges}>(this.apiModel.host + '/setupservice/api/add-new-prd-chrg' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addCharges'))
    ));
  }
  addLoanTerm(disb: LoanTerms): Observable<LoanTerms> {
    console.log(disb);
    return this.http.post<LoanTerms>(this.apiModel.host + '/setupservice/api/add-new-prd-loan-trm' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addLoanTerm'))
    ));
  }
  addSegregate(disb: Segregate): Observable<{PrdSgrtInst:Segregate}> {
    console.log(disb);
    return this.http.post<{PrdSgrtInst:Segregate}>(this.apiModel.host + '/setupservice/api/add-new-prd-sgrt-inst' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addSegregate'))
    ));
  }
  addProductRule(disb: AdvanceRules): Observable<{PrdAdvRul:AdvanceRules}> {
    console.log('add rule');
    console.log(disb);
    return this.http.post<{PrdAdvRul:AdvanceRules}>(this.apiModel.host + '/setupservice/api/add-new-prd-adv-rul' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addProductRule'))
    ));
  }
  addAccountingSetup(disb: AccountingSetup): Observable<{PrdAcctSet:AccountingSetup}> {
    console.log(disb);
    return this.http.post<{PrdAcctSet:AccountingSetup}>(this.apiModel.host + '/setupservice/api/add-new-prd-acct-set' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addAccountingSetup'))
    ));
  }
  addProductDocument(disb: ProductDocuments): Observable<{PrdDocRel:ProductDocuments}> {
    console.log(disb);
    return this.http.post<{PrdDocRel:ProductDocuments}>(this.apiModel.host + '/setupservice/api/add-new-prd-doc-rel' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        // this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addProductDocument'))
    ));
  }
  updateProductDocumentRel(disb): Observable<any> {
    return this.http.put<AccountingSetup>(this.apiModel.host + '/setupservice/api/update-prd-doc-rel' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p: AccountingSetup) => {
        console.log(p);
        this.toastr.success('Updated successfully', 'Success');
      }),
      catchError(this.handleError( 'updateAccountingSetup')));
  }
  updateAccountingSetup(disb: AccountingSetup): Observable<AccountingSetup> {
    return this.http.put<AccountingSetup>(this.apiModel.host + '/setupservice/api/update-prd-acct-set' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('updated successfully', 'Success');
      }),
      catchError(this.handleError( 'updateAccountingSetup'))));
  }
  updateSegregate(disb: Segregate): Observable<Segregate> {
    return this.http.put<Segregate>(this.apiModel.host + '/setupservice/api/update-prd-sgrt-inst' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p=> {
        console.log(p);
        this.toastr.success('updated successfully', 'Success');
      }),
      catchError(this.handleError( 'updateProductGroup'))));
  }
  updateCharges(disb: ProductCharges): Observable<ProductCharges> {
    return this.http.put<ProductCharges>(this.apiModel.host + '/setupservice/api/update-prd-chrg' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('updated successfully', 'Success');
      }),
      catchError(this.handleError( 'updateCharges'))));
  }
  updateProductGroup(disb: ProductGroup): Observable<ProductGroup> {
    return this.http.put<ProductGroup>(this.apiModel.host + '/setupservice/api/update-mw-prd-grp' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p=> {
        console.log(p);
        this.toastr.success('updated successfully', 'Success');
      }),
      catchError(this.handleError( 'updateProductGroup'))));
  }
  updateLoanTerm(disb: LoanTerms): Observable<LoanTerms> {
    return this.http.put<LoanTerms>(this.apiModel.host + '/setupservice/api/update-prd-loan-trm' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('updated successfully', 'Success');
      }),
      catchError(this.handleError( 'updateLoanTerm'))));
  }
  updatePrincipleAmount(disb: PrincipleAmount): Observable<PrincipleAmount> {
    return this.http.put<PrincipleAmount>(this.apiModel.host + '/setupservice/api/update-prd-ppal-lmt' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('updated successfully', 'Success');
      }),
      catchError(this.handleError( 'updatePrincipleAmount'))));
  }
  updateProduct(disb: Product): Observable<Product> {
    console.log(disb);
    return this.http.put<Product>(this.apiModel.host + '/setupservice/api/update-mw-prd' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        this.toastr.success('updated successfully', 'Success');
      }),
      catchError(this.handleError( 'updateProduct'))));
  }
  updateAdjustmentSequence(disb: AdjustmnentSequence): Observable<AdjustmnentSequence> {
    console.log(disb);
    return this.http.put<AdjustmnentSequence>(this.apiModel.host + '/setupservice/api/update-prd-chrg-adj-ordr' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p=> {
        console.log(p);
        this.toastr.success('updated successfully', 'Success');
      }),
      catchError(this.handleError( 'updateAdjustmentSequence'))));
  }
  getSegregates(disb: Segregate): Observable<Segregate[]> {
    console.log(disb);
    return this.http.post<Segregate[]>(this.apiModel.host + '/setupservice/api/mw-prd-sgrt-inst-enty-seq-and-key' ,
      disb, { headers: this.apiModel.httpHeaderPost }).pipe(
      tap((p => {
        console.log(p);
        // this.toastr.success('added successfully', 'Success');
      }),
      catchError(this.handleError( 'addLoanTerm'))
    ));
  }
  getAllProductGroups() {
    return this.http.get<ProductGroup>
    (this.apiModel.host + '/setupservice/api/mw-prd-grp/'  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllProductGroups')));
  }
  getChargesTypes() {
    return this.http.get<any>
    (this.apiModel.host + '/setupservice/api/mw-typs/1'  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getChargesTypes')));
  }
  getAllFormsAssignments() {
    return this.http.get<FormAssignment>
    (this.apiModel.host + '/setupservice/api/mw-form/'  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllFormsAssignments')));
  }

  getAllFormsAssignmentsBySeq(seq) {
    return this.http.get<FormAssignment>
    (this.apiModel.host + '/setupservice/api/mw-prd-form-rel-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllFormsAssignmentsBySeq')));
  }

  getAllAdjustmentSequencesBySeq(seq) {
    return this.http.get<AdjustmnentSequence>
    (this.apiModel.host + '/setupservice/api/mw-prd-chrg-adj-ordr-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllAdjustmentSequencesBySeq')));
  }
  getAccountingSetup(seq) {
    return this.http.get<AccountingSetup>
    (this.apiModel.host + '/setupservice/api/mw-prd-acct-set-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAccountingSetup')));
  }

  getGlAccounts() : Observable<any> {
    return this.http.get<any>
    (this.apiModel.host + '/setupservice/api/get-gl-accounts/' + this.auth.emp_branch , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getGlAccounts')));
  }

  getGlAccountsForAccountLedger(arr) : Observable<any> {
    return this.http.get<any>
    (this.apiModel.host + '/setupservice/api/get-gl-accounts/' + arr , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getGlAccounts')));
  }

  getAllPrincipleAmounts(seq) {
    return this.http.get<PrincipleAmount>
    (this.apiModel.host + '/setupservice/api/mw-prd-ppal-lmt-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllPrincipleAmounts')));
  }
  getAllCharges(seq) {
    return this.http.get<ProductCharges[]>
    (this.apiModel.host + '/setupservice/api/mw-prd-chrg-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllCharges')));
  }
  getAllBusinessSectors() {
    return this.http.get<BusinessSector>
    (this.apiModel.host + '/setupservice/api/mw-biz-sect/'  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllBusinessSectors')));
  }
  getAllDocumentsAssignment() {
    return this.http.get<ProductDocuments>
    (this.apiModel.host + '/setupservice/api/mw-doc/'  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllDocumentsAssignment')));
  }
  getAllDocumentsBySeq(seq) {
    return this.http.get<ProductDocuments>
    (this.apiModel.host + '/setupservice/api/mw-prd-doc-rel-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllDocumentsBySeq')));
  }
  getAllBusinessSectorBySeq(seq) {
    return this.http.get<BusinessSector>
    (this.apiModel.host + '/setupservice/api/mw-prd-biz-sect-rel-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllBusinessSectorBySeq')));
  }
  getAllLoanTerms(seq) {
    return this.http.get<LoanTerms>
    (this.apiModel.host + '/setupservice/api/mw-prd-loan-trm-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllLoanTerms')));
  }
  getAllProductByGrpSeq(seq) {
    return this.http.get<Product>
    (this.apiModel.host + '/setupservice/api/mw-prd-by-grp-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllProductByGrpSeq')));
  }
  getAllRules() {
    return this.http.get<ProductRules>
    (this.apiModel.host + '/setupservice/api/mw-rul/'  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllRules')));
  }
  getAllRulesBySeq(seq) {
    return this.http.get<ProductRules>
    (this.apiModel.host + '/setupservice/api/mw-prd-adv-rul-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllRulesBySeq')));
  }

  getAllAdvRulesBySeq(seq) {
    return this.http.get<ProductRules>
    (this.apiModel.host + '/setupservice/api/mw-prd-adv-rul-by-prd-seq/' + seq  , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllRulesBySeq')));
  }
  deleteFormAssignment(seq): Observable<FormAssignmentBody> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-form-rel/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        // this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deleteFormAssignment')));
  }
  deleteBusinessSector(seq): Observable<BusinessSector> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-biz-sect-rel/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        // this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deleteBusinessSector')));
  }
  deleteProductDocument(seq): Observable<ProductDocuments> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-doc-rel/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        // this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deleteProductDocument')));
  }
  deleteSegregate(seq): Observable<SegregateBody> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-sgrt-inst/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deleteItem')));
  }
  deleteProductGroup(seq): Observable<ProductGroup> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-grp/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deleteProductGroup')));
  }
  deletePrinicipleAmount(seq): Observable<PrincipleAmount> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-ppal-lmt/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deletePrinicipleAmount')));
  }
  deleteCharges(seq): Observable<ProductCharges> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-chrg/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deleteCharges')));
  }
  deleteLoanTerm(seq): Observable<LoanTerms> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-loan-trm/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deleteLoanTerm')));
  }
  deleteProductByPrdSeq(seq): Observable<Product> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        this.toastr.success('deleted successfully', 'Success');
      }),
      catchError(this.handleError('deleteProductByPrdSeq')));
  }
  deleteProductRule(seq): Observable<AdvanceRules> {
    const url = this.apiModel.host + '/setupservice/api/mw-prd-adv-rul/' + seq;
    return this.http.delete(url, { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((p: any) => {
        console.log(p);
        this.toastr.success('Rule Removed', 'Success');
      }),
      catchError(this.handleError('deleteProductRule')));
  }

  getProductsByTypSeq(seq) {
    return this.http.get<FormAssignment>
    (this.apiModel.host + '/setupservice/api/mw-prd-by-typ/' + seq , { headers: this.apiModel.httpHeaderGet } ).pipe(
      tap((data: any) => console.log(data)),
      catchError(this.handleError('getAllFormsAssignments')));
  }

  getBranchProducts() {
    return this.http.get<ProductGroup>
    (this.apiModel.host + '/recoverydisbursementservice/api/brnch-prds/'+this.auth.user.username   , { headers: this.apiModel.httpHeaderGet } ).pipe(
      catchError(this.handleError('getAllProductGroups')));
  }

  public handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      this.toastr.error(error.message, operation);

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
