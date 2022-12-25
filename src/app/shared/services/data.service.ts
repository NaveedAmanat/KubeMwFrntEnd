import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ApiModel } from '../models/Api.model';
import { UC } from '../models/UC.model';
import { Community } from '../models/community.model';
@Injectable({
	providedIn: 'root'
})
export class DataService {
	token: string;
	apiModel: ApiModel = new ApiModel();
	// url:string = "http://localhost:8080";
	url: string = this.apiModel.host;
	// url:string = "http://192.168.7.49:8080";
	//url:string = "http://192.168.100.17:8080";
	constructor(private http: HttpClient, private router: Router) {
		this.token = "Bearer " + sessionStorage.getItem("token");
	}
	//pagenation service
	getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
		// calculate total pages
		let totalPages = Math.ceil(totalItems / pageSize);

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
		let startIndex = (currentPage - 1) * pageSize;
		let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

		// create an array of pages to ng-repeat in the pager control
		let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

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
	createClient(object) {
		return this.http.post<{ clientSeq: "" }>(this.url + "/loanservice/api/create-mw-clnt", object, { headers: this.apiModel.httpHeaderPost });
	}
	//common services
	statusList() {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/vals-by-group-name?groupName=STATUS", { headers: this.apiModel.httpHeaderGet });
	}
	functionList() {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/vals-by-group-name?groupName=FUNCTION", { headers: this.apiModel.httpHeaderGet });
	}
	regionType() {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/vals-by-group-name?groupName=regionType", { headers: this.apiModel.httpHeaderGet });
	}
	createInfo(object) {
		return this.http.put<{ clientSeq: "" }>(this.url + "/loanservice/api/update-mw-clnt", object, { headers: this.apiModel.httpHeaderPost });
	}
	createLoanInfo(object) {
		return this.http.post<{ clientSeq: "", loanSeq: "" }>(this.url + "/loanservice/api/create-client-loan-application", object, { headers: this.apiModel.httpHeaderPost });
	}
	createInsuranceInfo(object) {
		return this.http.post<{ loanSeq: "", clntHlthInsrSeq: "" }>(this.url + "/loanservice/api/clnt-hlth-insr", object, { headers: this.apiModel.httpHeaderPost });
	}
	addInsuranceInfo(object) {
		return this.http.post<{ clntHlthInsrSeq: "" }>(this.url + "/loanservice/api/create-hlth-insr-memb", object, { headers: this.apiModel.httpHeaderPost });
	}
	addNomineeInfo(object) {
		return this.http.post<{ nomineeSeq: "" }>(this.url + "/loanservice/api/add-client-nominee", object, { headers: this.apiModel.httpHeaderPost });
	}

	addBusinessAppraisal(object) {
		return this.http.post<{ bizAprslSeq: "", incomeHdrSeq: "" }>(this.url + "/loanservice/api/create-biz-aprsls", object, { headers: this.apiModel.httpHeaderPost });
	}

	addPrimaryIncome(object) {
		return this.http.post<{ incomeDtlSeq: "" }>(this.url + "/loanservice/api/mw-biz-aprsl-incm-dtls", object, { headers: this.apiModel.httpHeaderPost });
	}
	addExpense(object) {
		return this.http.post<{ incomeDtlSeq: "" }>(this.url + "/loanservice/api/create-business-expense", object, { headers: this.apiModel.httpHeaderPost });
	}

	addExpenseLoan(object) {
		return this.http.post<{ incomeDtlSeq: "" }>(this.url + "/loanservice/api/mw-loan-utl-plans", object, { headers: this.apiModel.httpHeaderPost });
	}

	getUserLoanInfo(id) {
		return this.http.get(this.url + "/loanservice/api/mw-clnts/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	getAllLoanInfo() {
		return this.http.get(this.url + "/loanservice/api/mw-clnts/", { headers: this.apiModel.httpHeaderGet });
	}
	//common code services
	addCommonCode(object) {
		return this.http.post<{ groupSeq: "", group: any }>(this.url + "/setupservice/api/create-ref-cd-grps", object, { headers: this.apiModel.httpHeaderPost });
	}
	getAllCommonCode() {
		return this.http.get<{ refCdGrpCmnt: any, refCdGrpName: any, refCdGrp: any, refCdGrpSeq: any }>(this.url + "/setupservice/api/mw-ref-cd-grps", { headers: this.apiModel.httpHeaderGet });
	}
	updateAllCommonCode(object) {
		return this.http.put<{ refCdSeq: "", group: any }>(this.url + "/setupservice/api/update-ref-cd-grps", object, { headers: this.apiModel.httpHeaderPost });
	}
	editAllCommonCode(id) {
		return this.http.get<{ refCdGrpCmnt: any, refCdGrpName: any, refCdGrp: any, refCdGrpSeq: any }>(this.url + "/setupservice/api/mw-ref-cd-grps/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//common code value
	addCommonCodeValue(object) {
		return this.http.post<{ refCdSeq: "", group: any }>(this.url + "/setupservice/api/add-ref-cd-vals", object, { headers: this.apiModel.httpHeaderPost });
	}
	getCommonCodeValue(id) {
		return this.http.get(this.url + "/setupservice/api/ref-cd-vals-by-group/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	delCommonCodeValue(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-ref-cd-vals/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updateCommonCodeValue(object) {
		return this.http.put<{ refCdSeq: "", group: any }>(this.url + "/setupservice/api/update-ref-cd-vals", object, { headers: this.apiModel.httpHeaderPost });
	}
	editCommonCodeValue(id) {
		return this.http.get<{ activeFlg: any, sortOrder: any, activeStatus: any, refCdGrpKey: any, refCdSeq: any, refCdCmnt: any, refCdDscr: any, refCd: any }>(this.url + "/setupservice/api/mw-ref-cd-vals/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//Organization
	addOrganization(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/add-region", object, { headers: this.apiModel.httpHeaderPost });
	}
	getOrganization() {
		return this.http.get(this.url + "/setupservice/api/mw-regs", { headers: this.apiModel.httpHeaderGet });
	}
	delOrganization(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-regs/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updateOrganization(object) {
		return this.http.put<{ refCdSeq: "", region: any }>(this.url + "/setupservice/api/update-mw-regs", object, { headers: this.apiModel.httpHeaderPost });
	}
	editOrganization(id) {
		return this.http.get<{ regionSeq: any, regionCode: any, regionName: any, regionStatus: any, regionDescription: any, province: any, district: any, tehsil: any, uc: any, city: any, provinceName: any, districtName: any, tehsilName: any, ucName: any, cityName: any, houseNum: any, sreet_area: any, village: any, otherDetails: any }>(this.url + "/setupservice/api/mw-regs/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	StatusUpdateOrganization(id) {
		return this.http.put<{ regSeq: any, regNm: any, regTyp: any, regDscr: any, regStsKey: any }>(this.url + "/setupservice/api/update-region-status/" + id, { headers: this.apiModel.httpHeaderPost });
	}
	UserAssignmentOrganization(id) {
		return this.http.get<{ regionManager: any, clerk: any, manager: any }>(this.url + "/setupservice/api/get-employees-of-region/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	getAllEmps() {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/mw-all-emps", { headers: this.apiModel.httpHeaderGet });
	}
	addEmployeeOrganization(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/add-reg-emp-rels", object, { headers: this.apiModel.httpHeaderPost });
	}
	//area
	addArea(object) {
		return this.http.post<{ regSeq: "", area: any }>(this.url + "/setupservice/api/add-areas", object, { headers: this.apiModel.httpHeaderPost });
	}
	getArea(id) {
		return this.http.get(this.url + "/setupservice/api/areas-by-organization/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	delArea(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-areas/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updateArea(object) {
		return this.http.put<{ refCdSeq: "", area: any }>(this.url + "/setupservice/api/update-areas", object, { headers: this.apiModel.httpHeaderPost });
	}
	editArea(id) {
		return this.http.get<{ areaSeq: any, regionSeq: any, areaId: any, areaName: any, areaStatus: any, areaDescription: any, province: any, district: any, tehsil: any, uc: any, city: any, provinceName: any, districtName: any, tehsilName: any, ucName: any, cityName: any, houseNum: any, sreet_area: any, village: any, otherDetails: any }>(this.url + "/setupservice/api/mw-areas/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	StatusUpdateArea(id) {
		return this.http.put<{ areaSeq: any, regSeq: any, areaCd: any, areaNm: any, areaDscr: any, areaStsKey: any }>(this.url + "/setupservice/api/update-area-status/" + id, { headers: this.apiModel.httpHeaderPost });
	}
	UserAssignmentArea(id) {
		return this.http.get<any>(this.url + "/setupservice/api/get-employees-of-area/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	searchArea() {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/mw-all-emps", { headers: this.apiModel.httpHeaderGet });
	}
	addEmployeeArea(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/add-new-emp-reg-rels", object, { headers: this.apiModel.httpHeaderPost });
	}

	addAreaEmployee(object) {
		return this.http.post<any>(this.url + "/setupservice/api/add-area-emp-rels", object, { headers: this.apiModel.httpHeaderPost });
	}
	//branch
	addBranch(object) {
		return this.http.post<{ refCdSeq: "", branch: any }>(this.url + "/setupservice/api/add-brnches", object, { headers: this.apiModel.httpHeaderPost });
	}
	//Added by Areeba - Branch Setup
	addNewBranch(object) {
		return this.http.post<{ refCdSeq: "", branch: any }>(this.url + "/setupservice/api/add-new-brnches", object, { headers: this.apiModel.httpHeaderPost });
	}
	getBranch(id) {
		return this.http.get(this.url + "/setupservice/api/brnches-by-area/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	getBranchByUser() {
		return this.http.get(this.url + "/setupservice/api/mw-brnches-by-user" , { headers: this.apiModel.httpHeaderGet });
	}
	delBranch(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-brnches/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updateBranch(object) {
		return this.http.put<{ refCdSeq: "", branch: any }>(this.url + "/setupservice/api/update-brnches", object, { headers: this.apiModel.httpHeaderPost });
	}
	editBranch(id) {
		return this.http.get<{  brnchEmail: any, brnchPhNum: any,  brnchTypKey: any, branchSeq: any, areaSeq: any, branchCode: any, branchName: any, branchType: any, branchStatus: any, branchDescription: any, province: any, district: any, tehsil: any, uc: any, city: any, provinceName: any, districtName: any, tehsilName: any, ucName: any, cityName: any, houseNum: any, sreet_area: any, village: any, otherDetails: any }>(this.url + "/setupservice/api/mw-brnches/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	StatusUpdateBranch(id) {
		return this.http.put<{ brnchSeq: any, areaSeq: any, brnchCd: any, brnchNm: any, brnchDscr: any, brnchTypKey: any, brnchStsKey: any, brnchEmail: any, brnchPhNum: any }>(this.url + "/setupservice/api/update-brnch-status/" + id, { headers: this.apiModel.httpHeaderPost });
	}
	UserAssignmentBranch(id) {
		return this.http.get<any[]>(this.url + "/setupservice/api/get-employees-of-branch/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	AccountSetupBranch(id) {
		return this.http.get<{ brnchSeq: any, bankName: any, bankBrnch: any, acctNm: any, acctNum: any, iban: any }>(this.url + "/setupservice/api/brnch-acct-set-by-branch/" + id, { headers: this.apiModel.httpHeaderGet });
	}

	searchBranch() {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/mw-all-emps", { headers: this.apiModel.httpHeaderGet });
	}
	getAllEmployeeList() {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/mw-all-emps", { headers: this.apiModel.httpHeaderGet });
	}


	getAllEmployeeListForBrnch(brnchSeq, typ) {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/mw-emps/" + brnchSeq + "/" + typ, { headers: this.apiModel.httpHeaderGet });
	}
	addEmployeeBranch(object) {
		return this.http.post<any>(this.url + "/setupservice/api/add-mw-brnch-emp-rel", object, { headers: this.apiModel.httpHeaderPost });
	}
	AccountSetup(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/add-brnch-acct-sets", object, { headers: this.apiModel.httpHeaderPost });
	}
	UpdateAccountSetup(object) {
		return this.http.put<{ organization: "", region: any }>(this.url + "/setupservice/api/update-brnch-acct-set", object, { headers: this.apiModel.httpHeaderGet });
	}
	AssignLocation(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/add-brnch-location-rels", object, { headers: this.apiModel.httpHeaderPost });
	}

	assignLocation(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/add-brnch-location-rel", object, { headers: this.apiModel.httpHeaderPost });
	}

	removeLocation(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/remove-brnch-location-rels", object, { headers: this.apiModel.httpHeaderPost });
	}
	getAssignLocation() {
		return this.http.get<{ branchSeq: "", citySeq: any }>(this.url + "/loanservice/api/get-address-combinations/", { headers: this.apiModel.httpHeaderGet });
	}
	getAssignLocationExist(id) {
		return this.http.get(this.url + "/setupservice/api/get-brnch-location-rels/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	ProductAssign(object) {
		return this.http.post<{ branchSeq: "", citySeq: any }>(this.url + "/setupservice/api/add-brnch-prd-rels", object, { headers: this.apiModel.httpHeaderPost });
	}
	addProduct(object) {
		return this.http.post<{ branchSeq: "", citySeq: any }>(this.url + "/setupservice/api/add-brnch-prd-rel", object, { headers: this.apiModel.httpHeaderPost });
	}
	removeProduct(object) {
		return this.http.post<{ branchSeq: "", citySeq: any }>(this.url + "/setupservice/api/remove-brnch-prd-rel", object, { headers: this.apiModel.httpHeaderPost });
	}
	getProductAssign() {
		return this.http.get(this.url + "/setupservice/api/get-products-listing/", { headers: this.apiModel.httpHeaderGet });
	}
	getProductAssignExist(id) {
		return this.http.get(this.url + "/setupservice/api/get-brnch-prd-rels/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//portfolio
	addPortfolio(object) {
		return this.http.post<{ data: "", port: any }>(this.url + "/setupservice/api/add-new-portfolio", object, { headers: this.apiModel.httpHeaderPost });
	}
	getPortfolio(id) {
		return this.http.get(this.url + "/setupservice/api/mw-ports-by-branch/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	delPortfolio(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-ports/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updatePortfolio(object) {
		return this.http.put<{ refCdSeq: "", port: any }>(this.url + "/setupservice/api/update-portfolio", object, { headers: this.apiModel.httpHeaderPost });
	}
	//Edited by Areeba - 07-06-2022
	editPortfolio(id) {
		return this.http.get<{ protfolio_SEQ: any, brnchSeq: any, portCd: any, portNm: any, portCmnt: any, portSeq: any, portStsKey: any, portTyp: any }>(this.url + "/setupservice/api/mw-ports/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	StatusUpdatePortfolio(id) {
		return this.http.put<{ protfolio_SEQ: any, brnchSeq: any, portCd: any, portNm: any, portCmnt: any }>(this.url + "/setupservice/api/update-portfolio-status/" + id, { headers: this.apiModel.httpHeaderPost });
	}
	UserAssignmentPortfolio(id) {
		return this.http.get<{ regionManager: any, clerk: any, manager: any }>(this.url + "/setupservice/api/get-employees-of-port/" + id, { headers: this.apiModel.httpHeaderGet });
	}

	getUserAssignmentPortfolio(id): Observable<any[]> {
		return this.http.get<any[]>(this.url + "/setupservice/api/get-employees-of-port/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	searchPortfolio() {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/mw-all-emps", { headers: this.apiModel.httpHeaderGet });
	}

	getAllEmployee() {
		return this.http.get<{ result: any }>(this.url + "/setupservice/api/mw-all-emps", { headers: this.apiModel.httpHeaderGet });
	}
	addEmployeePortfolio(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/add-port-emp-rels", object, { headers: this.apiModel.httpHeaderPost });
	}
	AssignLocationPort(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/add-port-location-rels", object, { headers: this.apiModel.httpHeaderPost });
	}

	assignLocationPort(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/add-port-location-rel", object, { headers: this.apiModel.httpHeaderPost });
	}

	removeLocationPort(object) {
		return this.http.post<{ organization: "", region: any }>(this.url + "/setupservice/api/remove-port-location-rel", object, { headers: this.apiModel.httpHeaderPost });
	}
	getAssignLocationPort(id) {
		return this.http.get(this.url + "/setupservice/api/get-port-location-options/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	getAssignLocationExistPort(id) {
		return this.http.get(this.url + "/setupservice/api/get-port-location-rels/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	getAssignLocationPortFilter(id, filter: string) : Observable<any[]>{ 
		return this.http.get<any[]>(this.apiModel.host + '/setupservice/api/get-port-location-options-filter?id=' + id + '&filter=' + filter, {headers:this.apiModel.httpHeaderGet})
		  .pipe(tap((p: any[]) => console.log(p))
		  );
	  }


	//community
	addCommunity(object) {
		return this.http.post<{ data: "", cmnty: any }>(this.url + "/setupservice/api/add-new-cmnty", object, { headers: this.apiModel.httpHeaderPost });
	}
	getCommunity(id) {
		return this.http.get(this.url + "/setupservice/api/get-cmnties-by-portfolio/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	delCommunity(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-cmnties/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updateCommunity(object) {
		return this.http.put<{ refCdSeq: "", cmnty: any }>(this.url + "/setupservice/api/update-cmnties", object, { headers: this.apiModel.httpHeaderPost });
	}
	editCommunity(id) {
		return this.http.get<{ protfolioSeq: any, cmntySeq: any, cmntyNm: any, cmntyCmnt: any, cmntyCd: any, cmntyStsKey: any }>(this.url + "/setupservice/api/mw-cmnties/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//Added by Areeba - Branch Setup
	uploadCommunity (cmnty: Community[]): Observable<any> {
		return this.http.post<any>(this.apiModel.host+"/setupservice/api/upload-cmnty", cmnty , { headers: this.apiModel.httpHeaderGet }).pipe(
		  tap(heroes => console.log(`Uploaded Cmnty List`))
		);
	}
	StatusUpdateCommunity(id) {
		return this.http.put<{ protfolioSeq: any, cmntySeq: any, cmntyNm: any, cmntyCmnt: any }>(this.url + "/setupservice/api/update-community-status/" + id, { headers: this.apiModel.httpHeaderPost });
	}
	//Country
	addCountry(object) {
		return this.http.post<{ data: "", country: any }>(this.url + "/setupservice/api/add-cntry", object, { headers: this.apiModel.httpHeaderPost });
	}
	//Edited by Areeba
	getCountry(filter: string) {
		return this.http.get(this.url + '/setupservice/api/mw-cntries?filter=' + filter, { headers: this.apiModel.httpHeaderGet });
	}
	delCountry(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-cntries/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updateCountry(object) {
		return this.http.put<{ refCdSeq: "", country: any }>(this.url + "/setupservice/api/update-cntries", object, { headers: this.apiModel.httpHeaderPost });
	}
	editCountry(id) {
		return this.http.get<{ cntrySeq: any, cntryCd: any, cntryNm: any, cntryCmnt: any }>(this.url + "/setupservice/api/mw-cntries/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//Province
	addProvince(object) {
		return this.http.post<{ data: "", Province: any }>(this.url + "/setupservice/api/add-new-sts", object, { headers: this.apiModel.httpHeaderPost });
	}
	//Edited by Areeba
	getProvince(id, filter: string) {
		return this.http.get(this.url + "/setupservice/api/get-states-by-country/" + id + '?filter=' + filter, { headers: this.apiModel.httpHeaderGet });
	}
	getAllProvince() {
		return this.http.get(this.url + "/setupservice/api/mw-sts" , { headers: this.apiModel.httpHeaderGet });
	}
	delProvince(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-sts/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updateProvince(object) {
		return this.http.put<{ stSeq: "", Province: any }>(this.url + "/setupservice/api/update-sts", object, { headers: this.apiModel.httpHeaderPost });
	}
	editProvince(id) {
		return this.http.get<{ cntrySeq: any, stSeq: any, stCd: any, stNm: any, stCmnt: any }>(this.url + "/setupservice/api/mw-sts/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//District
	addDistrict(object) {
		return this.http.post<{ data: "", district: any }>(this.url + "/setupservice/api/add-new-dist", object, { headers: this.apiModel.httpHeaderPost });
	}
	//Edited by Areeba
	getDistrict(id, filter: string) {
		return this.http.get(this.url + "/setupservice/api/get-dists-by-state/" + id + '?filter=' + filter, { headers: this.apiModel.httpHeaderGet });
	}
	// CR-Donor Tagging
  	// fetch all district
	// Added By Naveed - 20-12-2021
	getAllDistrict() {
		return this.http.get(this.url + "/setupservice/api/mw-dists/" , { headers: this.apiModel.httpHeaderGet });
	}
	// Ended By Naveed - 20-12-2021
	
	delDistrict(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-dists/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updateDistrict(object) {
		return this.http.put<{ district: "", distSeq: any }>(this.url + "/setupservice/api/update-dists", object, { headers: this.apiModel.httpHeaderPost });
	}
	editDistrict(id) {
		return this.http.get<{ stSeq: any, distSeq: any, distCd: any, distNm: any, distCmnt: any }>(this.url + "/setupservice/api/mw-dists/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//Tehsil
	addTehsil(object) {
		return this.http.post<{ data: "", tehsil: any }>(this.url + "/setupservice/api/add-new-thsl", object, { headers: this.apiModel.httpHeaderPost });
	}
	//Edited by Areeba
	getTehsil(id, filter: string) {
		return this.http.get(this.url + "/setupservice/api/get-states-by-district/" + id + '?filter=' + filter, { headers: this.apiModel.httpHeaderGet });
	}
	getAllTehsil(){
		return this.http.get(this.url + "/setupservice/api/mw-thsls", { headers: this.apiModel.httpHeaderGet });
	}
	delTehsil(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-thsls/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	updateTehsil(object) {
		return this.http.put<{ thslSeq: "", tehsil: any }>(this.url + "/setupservice/api/update-thsl", object, { headers: this.apiModel.httpHeaderPost });
	}
	editTehsil(id) {
		return this.http.get<{ distSeq: any, thslSeq: any, thslCd: any, thslNm: any, thslCmnt: any }>(this.url + "/setupservice/api/mw-thsls/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//Union Council 
	addUN(object) {
		return this.http.post<{ data: "", uc: any }>(this.url + "/setupservice/api/add-new-uc", object, { headers: this.apiModel.httpHeaderPost });
	}
	//Added by Areeba
	getAllUN(){
		return this.http.get(this.url + "/setupservice/api/mw-ucs", { headers: this.apiModel.httpHeaderGet });
	}
	//Edited by Areeba
	getUN(id, filter: string) {
		return this.http.get(this.url + "/setupservice/api/get-ucs-by-thsl/" + id + '?filter=' + filter, { headers: this.apiModel.httpHeaderGet });
	}
	delUN(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-ucs/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	removeUN(id, citySeq, brnchSeq) {
		return this.http.delete(this.url + "/setupservice/api/mw-ucs-brnch/" + id + "/" + citySeq + "/" + brnchSeq, { headers: this.apiModel.httpHeaderGet });
	}
	updateUN(object) {
		return this.http.put<{ ucSeq: any, uc: any }>(this.url + "/setupservice/api/update-ucs", object, { headers: this.apiModel.httpHeaderPost });
	}
	editUN(id) {
		return this.http.get<{ thslSeq: any, ucSeq: any, ucCd: any, ucNm: any, ucCmnt: any, ucStsKey: any }>(this.url + "/setupservice/api/mw-ucs/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//Added by Areeba - Branch Setup
	uploadUN (uc: UC[]): Observable<any> {
		return this.http.post<any>(this.apiModel.host+"/setupservice/api/upload-uc", uc , { headers: this.apiModel.httpHeaderGet }).pipe(
		  tap(heroes => console.log(`Uploaded UC List`))
		);
	}
	//communicatioin workflow rule 
	getCommunicatioinWorkflow() {
		return this.http.get(this.url + "/setupservice/api/mw-comm-wfs", { headers: this.apiModel.httpHeaderGet });
	}
	//Aproval workflow delete
	delCommunicatioinWorkflow(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-comm-wfs/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//communicatioin workflow rule 
	addWorkflowRule(object) {
		return this.http.post<{ data: "", commSeq: any }>(this.url + "/setupservice/api/add-new-comm-wfs", object, { headers: this.apiModel.httpHeaderPost });
	}
	updateCommunicatioinWorkflowRule(object) {
		return this.http.put<{ refCdSeq: "", commSeq: any }>(this.url + "/setupservice/api/update-comm-wfs", object, { headers: this.apiModel.httpHeaderPost });
	}
	editCommunicatioinWorkflowRule(id) {
		return this.http.get<{ ruleCriteria: any, ruleName: any, functionKey: any, workflowComments: any, action: any, actionSeq: any, taskSubject: any, taskDays: any, taskDueable: any, taskDate: any, taskAssignTo: any, taskStatus: any, workflowSeq: any, messageRecpientType: any, messageText: any, individualPhone: any, isClientPhone: any, coBorrowerPhone: any, spousePhone: any, emailRecepient: any, emailSubject: any, emailText: any, emailAddress: any, isGroup1: any, isGroup2: any, isGroup3: any, dueDtSeq: any }>(this.url + "/setupservice/api/mw-comm-wfs/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	//communicatioin workflow Action 
	addWorkflowAction(object) {
		return this.http.post<{ data: "", dueDtSeq: any }>(this.url + "/setupservice/api/add-comm-wf-msgs", object, { headers: this.apiModel.httpHeaderPost });
	}
	updateCommunicatioinWorkflowAction(object) {
		return this.http.put<{ refCdSeq: "", commSeq: any, dueDtSeq: any }>(this.url + "/setupservice/api/update-comm-wf-msgs", object, { headers: this.apiModel.httpHeaderPost });
	}
	editCommunicatioinWorkflowAction(id) {
		return this.http.get(this.url + "/setupservice/api/mw-comm-wfs/" + id, { headers: this.apiModel.httpHeaderGet });
	}
	/*//communicatioin workflow rule 
	addWorkflowRule(object){
	  const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
				'Authorization': this.token
			})
		};
	  return this.http.post<{data:"", commSeq:any}>(this.url+"/setupservice/api/add-new-comm-wfs",object, httpOptions );
	}*/
	//Aproval workflow listing
	getAprovalWorkflow() {
		return this.http.get(this.url + "/setupservice/api/mw-aprvl-wfs", { headers: this.apiModel.httpHeaderGet });
	}
	//Aproval workflow add  
	addAprovalWorkflow(object) {
		return this.http.post<{ data: "", aprvlSeq: any }>(this.url + "/setupservice/api/add-new-aprvl-wfs", object, { headers: this.apiModel.httpHeaderPost });
	}
	//Aproval workflow delete
	delAprovalWorkflow(id) {
		return this.http.delete(this.url + "/setupservice/api/mw-aprvl-wfs/" + id, { headers: this.apiModel.httpHeaderGet });
	}

	getDvcRgstrFrTyp(typFlg, typSeq) {
		return this.http.get(this.url + "/setupservice/api/get-registerd-device/" + typFlg + "/" + typSeq, { headers: this.apiModel.httpHeaderGet });
	}

	unregisterDevice(obj) {
		return this.http.put(this.url + "/setupservice/api/unregister-dvc", obj, { headers: this.apiModel.httpHeaderGet });
	}

	registerDevice(obj) {
		return this.http.post(this.url + "/setupservice/api/register-dvc", obj, { headers: this.apiModel.httpHeaderGet });
	}

	//Added by Areeba - Phone Num on Device Register
	getLastDvcPhNum(entyTypSeq) {
		return this.http.get(this.url + "/setupservice/api/get-last-device-ph-num/" + entyTypSeq, { headers: this.apiModel.httpHeaderGet });
	}

	// added by Naveed - Date - 23-01-2022
	// SCR - Munsalik Integration
	// get Online Collection Channel
	getChannelList(): Observable<any> {
		return this.http.get<any>(this.apiModel.host + '/reportservice/api/get-channel-cmpny-list', { headers: this.apiModel.httpHeaderGet });
	  }
	// Ended by Naveed - Date - 23-01-2022

	// Added By Naveed - Date - 24-02-2022 
	// SCR - Upaisa and HBL Konnect Payment Mode 
	getTypsMobileWalletModes(): Observable<any> {
		return this.http.get<any>(this.apiModel.host + '/setupservice/api/mw-typs-mobile-wallet', { headers: this.apiModel.httpHeaderGet });
	  }
	//  Ended by Naveed - Date - 25-02-2022

	// listingInsuranceInfo(id){
	//   const authorization = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBZG1pbiIsImF1dGgiOiJhZG1pbiIsImV4cCI6MTUzMDI4MDcxMn0.nxRE4W_BvrUJ0J9nLVRYJn8zUp7I0i07Sqpl-_ByRz_H4otEijtjBadLS4FKNV1GQaDkiz1sJl5x421EJ89P_Q";
	//   const httpOptions = {
	// 		headers: new HttpHeaders({
	// 			'Content-Type':  'application/json',
	// 			'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
	// 			'Authorization': this.token
	// 		})
	// 	};
	//   return this.http.get("http://192.168.9.40:8080/loanservice/api/mw-clnt-hlth-members/"+id, httpOptions );
	// }
}
