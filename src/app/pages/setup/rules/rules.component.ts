import { Component, OnInit, ViewChild } from '@angular/core';
import { Rule } from '../../../shared/models/Rule.model';
import { RULES, RULES_CATEGORIES } from '../../../shared/mocks/rules.mocks';
import { Router } from '@angular/router';
import { RulesService } from '../../../shared/services/rules.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {
  rules: Rule[] = [];
  rule: Rule = new Rule();
  categories = RULES_CATEGORIES;
  RuleForm: FormGroup;
  fields = [];
  advFields = [{ heading: "Client", columns: [{ title: "First Name", column: "CLNT_FRST_NAME" }, { title: "Last Name", column: "LAST_NM" }, { title: "Age", column: "CLNT_AGE" }] },
  { heading: "Credit Application", columns: [{ title: "Loan Cycle No.", column: "LOAN_CYCL_NUM" }, { title: "Recommended Loan Amount", column: "RCMND_LOAN_AMT" }, { title: "Aproved Loan Amount", column: "APRVD_LOAN_AMT" }, { title: "Service Charge", column: "SRVC_CHRG" }, { title: "Aproved Loan Amount", column: "APRVD_LOAN_AMT" }, { title: "Aproved Loan Amount", column: "APRVD_LOAN_AMT" }] },
  { heading: "Nominee", columns: [{ title: "First Name", column: "NOM_FIRST_NAME" }, { title: "Age", column: "NOM_AGE" }] },
  { heading: "Next Of Kin", columns: [{ title: "Age", column: "KIN_AGE" }] },
  { heading: "Business Apprisal", columns: [{ title: "Business Income", column: "BIZ_INC" }, { title: "Primary Income", column: "PRM_INCM" }, { title: "Secondary Income", column: "SEC_INCM" }, { title: "Business Expense", column: "BIZ_EXP" }, { title: "Household Expense", column: "HSLD_EXP" }, { title: "Business Tenure", column: "BIZ_TNR" }, { title: "Net Desposable Income", column: "NDI" }] },
  { heading: "PSC", columns: [{ title: "Poverty Criteria", column: "PVRTY_CRTR" }] },
  { heading: "School Appraisal", columns: [{ title: "School Profit", column: "SCH_PROFIT" }, { title: "Total Fee", column: "TOT_FEE" }, { title: "Primary Income", column: "SCH_PRM_INCM" }, { title: "Secondary Income", column: "SCH_SEC_INCM" }, { title: "Business Expense", column: "SCH_BIZ_EXP" }, { title: "Household Expense", column: "SCH_HSLD_EXP" }, { title: "School Tenure", column: "SCH_TNR" }, { title: "Female Students Percentage", column: "FEMSSTDNTS_PER" }, { title: "Total Students", column: "TOT_STDNTS" }, { title: "No Fee Students", column: "TOTNOFEESTDNTS" }, { title: "School Income", column: "SCH_INCM" }] },
  { heading: "Installment", columns: [{ title: "No. of Paid Installments", column: "PAID_INST_NUM" }] }];

  basicFields = [{ heading: "Client", columns: [{ title: "First Name", column: "FRST_NM" }, { title: "Last Name", column: "LAST_NM" }, { title: "Number Of Dependants", column: "NUM_OF_DPND" }, { title: "Earning Members", column: "ERNG_MEMB" }, { title: "Household Members", column: "HSE_HLD_MEMB" }, { title: "Number Of Children", column: "NUM_OF_CHLDRN" }, { title: "Gender", column: "GNDR_KEY" }, { title: "Marital Status", column: "MRTL_STS_KEY" }, { title: "Education Level", column: "EDU_LVL_KEY" }, { title: "Occupation", column: "OCC_KEY" }, { title: "Nature of Disabilty", column: "NATR_OF_DIS_KEY" }, { title: "DOB", column: "DOB" }] }];
  ruleCategories = [{ value: 1, desc: "Basic" }, { value: 2, desc: "Advance" }];
  constructor(private router: Router,
    private rulesService: RulesService,
    private toastr: ToastrService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toaster: ToastrService) { }


    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: any;
  
    applyFilter(filterValue: string) {
      this.filterValue = filterValue;
      if (this.filterValue.length == 0) {
        this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageIndex = 0;
        this.datalength = this.countBeforeFilter;
        this.lastPageIndex = this.lastPageIndexBeforeFilter;
        return;
      }
      this.getFilteredData(filterValue.trim().toLowerCase())
    }
  
    searchValue() {
      this.filterValue = this.searchVal.trim();
      if (this.filterValue.length == 0) {
        this.dataSource = new MatTableDataSource(this.dataBeforeFilter);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageIndex = 0;
        this.lastPageIndex = this.lastPageIndexBeforeFilter;
        this.datalength = 0;
        setTimeout(() => { this.datalength = this.countBeforeFilter; }, 200);
        return;
      }
    }
  
    dataSource: any;
    datalength: Number = 0;
    lastPageIndex = 0;
    dataBeforeFilter; 
    countBeforeFilter;
    lastPageIndexBeforeFilter;
  
    filterValue: any = "";
    searchVal = "";
    isCount: boolean = true;


  ngOnInit() {
    this.displayedColumns = ['ruleid', 'ruleName', 'ruleCate', 'comnt', 'criteria', 'action'];
    this.getRules();
    this.RuleForm = this.formBuilder.group({
      rulSeq: [''],
      rulId: [''],
      rulCtgryKey: ['', Validators.required],
      rulNm: ['', Validators.required],
      rulCmnt: ['', Validators.required],
      rulCrtraStr: ['', Validators.required]
    });
  }
  findCategory(id) {
    let cat = '';
    this.ruleCategories.forEach(c => {
      if (c.value == id)
        cat = c.desc;
    })
    return cat;
  }
  onSubmit() {
    console.log(this.rule);
    if (!this.isEdit) {
      this.rulesService.addRule(this.RuleForm.value).subscribe(res => {
        this.toastr.success('Rule Saved', 'Success');
        (<any>$('#AdvanceRules')).modal('hide');
        this.getRules();
      }, error => {
        this.toastr.error("Invalid Rule Criteria String", "Error")
      })
    } else {
      this.rulesService.updateRule(this.RuleForm.value).subscribe(res => {
        this.toastr.success('Rule Saved', 'Success');
        (<any>$('#AdvanceRules')).modal('hide');
        this.getRules();
      }, error => {
        this.toastr.error("Invalid Rule Criteria String", "Error")
      })
    }
  }
  setSideBarListener() {
    $('.acc_trigger').toggleClass('inactive-header');
    $('.acc_trigger').click(function () {
      if ($(this).next().is(':hidden')) {
        $('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
        $(this).toggleClass('active-header').toggleClass('inactive-header');
        $(this).next().slideToggle().toggleClass('open-content');
      }
      else {
        $(this).toggleClass('active-header').toggleClass('inactive-header');
        $(this).next().slideToggle().toggleClass('open-content');
      }
    });
  }
  addNewRule() {
    this.isEdit = false;
    this.RuleForm.reset();
    (<any>$('#AdvanceRules')).modal('show');
  }
  isEdit = false;
  onEditRule(rule) {
    this.isEdit = true;
    this.RuleForm.reset();
    this.RuleForm = this.formBuilder.group({
      rulSeq: [rule.rulSeq],
      rulId: [rule.rulId],
      rulCtgryKey: [rule.rulCtgryKey, Validators.required],
      rulNm: [rule.rulNm, Validators.required],
      rulCmnt: [rule.rulCmnt, Validators.required],
      rulCrtraStr: [rule.rulCrtraStr, Validators.required]
    });
    this.onCategoryChange();
    (<any>$('#AdvanceRules')).modal('show');
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadNextPage())
      )
      .subscribe();
  }

  private getRules() {
    this.isCount = true;
    this.spinner.show();
    this.rules = [];
    this.dataSource = new MatTableDataSource(this.rules);
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.filterValue = '';

    this.rulesService.getRules(this.paginator.pageIndex, 10, "", this.isCount).subscribe(response => {
      this.spinner.hide();
      this.rules = response.rules
      this.dataSource = new MatTableDataSource(this.rules);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = response.count;

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = response.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;

  }, error => {
    this.spinner.hide();
    console.log(error)
  });
}

loadNextPage(){
  this.isCount = false;
  if (this.paginator.pageIndex < this.lastPageIndex)
  return
  if (this.dataSource.paginator.length == this.dataSource.data.length)
  return;
  if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
    this.spinner.show();
    this.rulesService.getRules(this.paginator.pageIndex, this.paginator.pageSize, this.filterValue, this.isCount).subscribe(response => {
      this.spinner.hide();
      this.rules = response.rules;
      this.lastPageIndex = this.lastPageIndex + 1;
      this.dataSource.data = this.dataSource.data.concat(response.rules);
      response.count = this.datalength; 
      this.datalength = 0;
      setTimeout(() => { this.datalength = response.count; }, 200);

      if (this.filterValue.length == 0) {
        this.dataBeforeFilter = this.dataSource.data;
        this.countBeforeFilter = response.count;
        this.lastPageIndexBeforeFilter = this.lastPageIndex;
      }
    }, error =>{
        this.spinner.hide();
        console.log('err', error);
    });
  }
}

getFilteredData(filterValue:string){
  this.isCount = true;
    this.paginator.pageIndex = 0;
    this.spinner.show();
    this.rulesService.getRules(this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe(response => {
      this.rules = response.rules;
      this.spinner.hide();
      if (this.rules.length <= 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.rules);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = response.count;
    }, error =>{
      this.spinner.hide();
      console.log('err', error);
      });
}

  copyToMain(column) {
    this.RuleForm.controls['rulCrtraStr'].setValue((this.RuleForm.controls['rulCrtraStr'].value == null ? "" : this.RuleForm.controls['rulCrtraStr'].value) + " " + column.column);
  }

  onCategoryChange() {
    this.fields = [];
    if (this.RuleForm.controls['rulCtgryKey'].value == 1) {
      this.fields = this.basicFields;
    } else {
      this.fields = this.advFields;
    }
  }

  headingClick(ev) {
    $(ev).toggleClass('inactive-header');
    if ($(ev).next().is(':hidden')) {
      $('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
      $(ev).toggleClass('active-header').toggleClass('inactive-header');
      $(ev).next().slideToggle().toggleClass('open-content');
    } else {
      $(ev).toggleClass('active-header').toggleClass('inactive-header');
      $(ev).next().slideToggle().toggleClass('open-content');
    }
  }

  //delete
  onDeleteRul(passedId) {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this Rule?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.rulesService.deleteRule(passedId).subscribe(result => {
          //this.pagedItems.splice(this.pagedItems.indexOf(passedId), 1);
          this.getRules();
          swal(
            'Deleted!',
            'Rule has been deleted.',
            'success'
          )
        }, error => console.log('There was an error: ', error));
      }
    })

  }
  showFields = false;
  showField() {
    this.showFields = true;
  }
  closeField() {
    this.showFields = false;
  }
}