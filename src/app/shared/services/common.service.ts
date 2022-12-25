import { ApiModel } from '../models/Api.model';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { lov } from '../models/lov.model';
import { tap, catchError } from 'rxjs/operators';
import { Community } from '../models/community.model';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';
import { formatDate } from '@angular/common';
import { PaymentSchedule } from '../models/paymentSchedule.model';
import { Auth } from '../models/Auth.model';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    auth: Auth = JSON.parse(sessionStorage.getItem('auth'));
    apiModel: ApiModel = new ApiModel();
    token: string;

    constructor(public http: HttpClient,
        private router: Router
        , private spinner: NgxSpinnerService,
        @Inject(LOCALE_ID) private locale: string) {
        this.token = 'Bearer ' + sessionStorage.getItem('token');
    }

    getValues(groupName: string): Observable<lov[]> {
        return this.http.get<lov[]>(this.apiModel.host + '/setupservice/api/ref-cd-vals-by-group-key/' + groupName, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: lov[]) => console.log(p)),
                catchError(this.handleError<lov[]>('Get Group Vlaues : ' + groupName))
            );
    }
    getValuesByRefCdGRp(refCdGrp: string): Observable<lov[]> {
        return this.http.get<lov[]>(this.apiModel.host + '/setupservice/api/ref-cd-val-by-ref-cd-grp/' + refCdGrp, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: lov[]) => console.log(p)),
                catchError(this.handleError<lov[]>('Get Group Vlaues : ' + refCdGrp))
            );
    }
    getSectors(prdSeq: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiModel.host + '/setupservice/api/mw-biz-sect-prd/' + prdSeq, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: lov[]) => console.log(p)),
                catchError(this.handleError<any[]>('Get Group Vlaues : ' + prdSeq))
            );
    }

    getActivity(sectSeq: string): Observable<any[]> {
        return this.http.get<any[]>(this.apiModel.host + '/setupservice/api/mw-biz-acty-sect/' + sectSeq, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: lov[]) => console.log(p)),
                catchError(this.handleError<any[]>('Get Group Vlaues : ' + sectSeq))
            );
    }

    getValuesByGroupName(name) {
        return this.http.get<any[]>
            (this.apiModel.host + '/setupservice/api/vals-by-group-name?groupName=' + name, { headers: this.apiModel.httpHeaderGet }).pipe(
                tap((data: any) => console.log(data)),
                catchError(this.handleError('getValuesByGroupName')));
    }

    getGlAccounts(): Observable<any> {
        return this.http.get<any>
            (this.apiModel.host + '/setupservice/api/gl-accounts', { headers: this.apiModel.httpHeaderGet }).pipe(
                tap((data: any) => console.log(data)),
                catchError(this.handleError('getGlAccounts')));
    }
    getCommunity(): Observable<Community[]> {
        return this.http.get<Community[]>(this.apiModel.host + '/setupservice/api/get-employee-cmnties', { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: Community[]) => console.log(p)),
                catchError(this.handleError<Community[]>('Get Community'))
            );
    }

    getCommunityForPort(seq): Observable<Community[]> {
        return this.http.get<Community[]>(this.apiModel.host + '/setupservice/api/get-cmnties-by-portfolio/' + seq, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: Community[]) => console.log(p)),
                catchError(this.handleError<Community[]>('Get Community'))
            );
    }

    getAllFilters(): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/setupservice/api/get-filters/6', { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => console.log(p))
            );
    }

    getOrganizationforUser(user): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-ports-for-user/' + user, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => console.log(p))
            );
    }

    applyFilter(path: string, id): Observable<any> {
        this.spinner.show();
        return this.http.get<any>(this.apiModel.host + '/loanservice/api/get-clients-listing-with-filters/' + path + '/' + id, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); this.spinner.hide(); })
            );
    }

    getAssociateProductsForProduct(obj): Observable<any> {
        return this.http.post<any>(this.apiModel.host + '/setupservice/api/get-asoc-prds-for-client', obj, { headers: this.apiModel.httpHeaderPost })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    getRecoveryStatus(seq): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/recoverydisbursementservice/api/upcomeing-due-installment/' + seq, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }
    getAllAttendanceForToday(obj): Observable<any> {
        return this.http.post<any>(this.apiModel.host + '/adminservice/api/get-attendance-for-date', obj, { headers: this.apiModel.httpHeaderPost })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    getStatusListing(): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/adminservice/api/attendance-status-list', { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    generateAttendanceForToday(obj): Observable<any> {
        return this.http.post<any>(this.apiModel.host + '/adminservice/api/insert-attendance-for-date', obj, { headers: this.apiModel.httpHeaderPost })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    updateAttendanceForEmployee(obj): Observable<any> {
        return this.http.post<any>(this.apiModel.host + '/adminservice/api/update-employee-attendance', obj, { headers: this.apiModel.httpHeaderPost })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }
    getLeaveSummary(obj): Observable<any> {
        return this.http.post<any>(this.apiModel.host + '/adminservice/api/get-employee-leave-request', obj, { headers: this.apiModel.httpHeaderPost })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    // Added by Zohaib Asim - Dated 11/11/2020
    // reverse Leave Request
    reverseLeaveRequest(employeeId, appDate): Observable<any> {
        return this.http.delete<any>(this.apiModel.host + '/adminservice/api/reverse-employee-leave-request/' + employeeId + '/' + appDate, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }
    // Added by Zohaib Asim - Dated 5/11/2020
    // Will fetch the details of Leave Balance by Employee and Leave ID
    getLeaveBalanceByEmployeeLeaveId(empId: string, leaveId: number): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/adminservice/api/get-employee-leave-balance/' + empId + '/' + leaveId, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    // Will fetch the details of Leave Balance by Employee, Leave ID and Attendance Date
    getLeaveBalanceByEmployeeLeaveIdAndAttDate(empId: string, leaveId: number, attendanceDate: string): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/adminservice/api/get-employee-leave-balance/' + empId + '/' + leaveId + '/' + attendanceDate, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    // Get Attendance details
    getAttendanceDetails(employeeId: string, appDate: string): Observable<any>{
        return this.http.get<any>(this.apiModel.host + '/adminservice/api/get-attendance-details/' + employeeId + '/' + appDate, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }
    // End by Zohaib

    saveLeaveSummary(obj): Observable<any> {
        return this.http.post<any>(this.apiModel.host + '/adminservice/api/save-employee-leave-request', obj, { headers: this.apiModel.httpHeaderPost })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    postAllPostFlg(date): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/adminservice/api/post-attendance-for-date-get/' + this.auth.emp_branch + '/' + date, { headers: this.apiModel.httpHeaderPost })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    getBrnchsForUsr(): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-brnches-by-user', { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }

    // Added by Zohaib Asim - Dated 16-12-2020
    // Health Claim Types
    getHlthClmTypes(): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/setupservice/api/hlth-clm-types', { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); })
            );
    }
    // End by Zohaib Asim 
	
	 // Added By Naveed - Dated 29-7-2021
    // MWX Rectification for ITO and Admin
    checkPermission(formName: string, model){
        console.log('loan_app_sts_seq', model.loan_app_sts_seq)
        if(model.loan_app_sts_seq == 704) {
            return false;
        }else{
            return this.auth.role=='admin' || this.auth.role=='ito' ? true : false
        }
    }
	// End by Naveed

    // CR-Donor Tagging
  	// fetch all district with branches
	// Added By Naveed - 20-12-2021
    getDistBrnch(): Observable<any[]> {
        return this.http.get<any[]>(this.apiModel.host + '/adminservice/api/dist-branch-detail/', { headers: this.apiModel.httpHeaderGet })
         .pipe(tap((p: lov[]) => console.log(p)),
            catchError(this.handleError<any[]>('dist-branch-detail : ')));
    }
    // Ended By Naveed - 20-12-2021


      /**
        * Added By Naveed - Date - 10-05-2022
        * SCR - Accounts 
    */
    getStpConfigValByGrpCd(grpCd): Observable<any> {
        return this.http.get<any>(this.apiModel.host + '/setupservice/api/get-stp-val-by-grpCd/' + grpCd, { headers: this.apiModel.httpHeaderGet })
            .pipe(tap((p: any) => { console.log(p); }));
    }
	
    public handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
    formatDate(date) {
        if (date === '') {
            return;
        }
        console.log(date);
        return formatDate(date, 'dd/MM/yyyy', this.locale);
    }
    formatDateCustom(date, formate) {
        if (date === '') {
            return;
        }
        console.log(date);
        return formatDate(date, formate, this.locale);
    }
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
