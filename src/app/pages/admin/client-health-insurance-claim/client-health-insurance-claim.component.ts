import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import swal from 'sweetalert2';
import { ClientHealthInsuranceClaim } from 'src/app/shared/models/client-health-insurance-claim.model';
import { ClientHealthInsuranceClaimService } from 'src/app/shared/services/client-health-insurance-claim.service';
import { DisbursementService } from 'src/app/shared/services/disbursement.service';
import { Auth } from 'src/app/shared/models/Auth.model';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from 'src/app/shared/services/expense.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Branch } from 'src/app/shared/models/branch.model';
import { TransfersService } from 'src/app/shared/services/transfers.service';
// Added by Zohaib Asim - Dated 16-12-2020
import { RefCdVal } from 'src/app/shared/models/ref-cd-val.model';
import { Expense } from 'src/app/shared/models/expense.model';
import { PaymentType } from 'src/app/shared/models/paymentType.model';
import { PaymentTypesService } from 'src/app/shared/services/paymentTypes.service';
import { AccessRecoveryService } from 'src/app/shared/services/access-recovery.service';
// End by Zohaib Asim

@Component({
  selector: 'app-client-health-insurance-claim',
  templateUrl: './client-health-insurance-claim.component.html',
  styleUrls: ['./client-health-insurance-claim.component.css']
})


export class ClientHealthInsuranceClaimComponent implements OnInit {
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


  auth;
  claimStatusArray: any[];
  paymentArray: any[];
  isCash: boolean = false;
  nameArray: string[];
  branchs: Branch[];
  branchForm: FormGroup;
  onBranchSelection: boolean = false;

  // Added by zohaib Asim - Dated 16-12-2020
  // Health Insurance Claim Types
  hlthClmTypes: RefCdVal[];
  hlthClmTypeForm : FormGroup;
  //

  dataSource: any;
  datalength: Number = 0;
  lastPageIndex = 0;
  dataBeforeFilter;
  countBeforeFilter;
  lastPageIndexBeforeFilter;

  filterValue: any = "";
  searchVal = "";
  isCount: boolean = true;

  public clientHealthInsuranceClaims: ClientHealthInsuranceClaim[];
  public addClientHealthInsuranceClaim: ClientHealthInsuranceClaim = new ClientHealthInsuranceClaim();
  public isEdit: Boolean = false;

  clientHealthInsuranceClaimForm: FormGroup;
  submitted = false;

  showFields = false;
  showField() {
    this.showFields = true;
  }


  constructor(private formBuilder: FormBuilder, private clientHealthInsuranceClaimService: ClientHealthInsuranceClaimService, private commonService: CommonService,
    private expenseService: ExpenseService, private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private transfersService: TransfersService, private paymentTypesService: PaymentTypesService,
    private accessRecoveryService: AccessRecoveryService) {
    this.auth = JSON.parse(sessionStorage.getItem('auth'));
  }

  ngOnInit() {

    this.displayedColumns = ['brnch', 'clntId', 'clntName', 'clmAmount', 'clmId', 'action'];
    this.clientHealthInsuranceClaimForm = this.formBuilder.group({
      brnchSeq: ['', Validators.required],
      clntSeq: ['', Validators.required],
      clmAmt: ['', Validators.required],
      transactionId: ['', Validators.required],
      clmStsKey: [''],
      paymentMode: ['', Validators.required],
      instrumentNum: ['', Validators.required],
      clntHlthClmSeq: ['']
    });
    this.expenseService.getPaymentModes().subscribe((data) => {
      this.paymentArray = data;
    });
    this.commonService.getValues('0258').subscribe(
      d => this.claimStatusArray = d
    );

    this.branchForm = this.fb.group({
      branch: [this.auth.emp_branch],
    });

    // this.transfersService.getBranches().subscribe(d => {
    //   this.branchs = d;
    //   console.log(this.branchs)
    // });

    // Added by Zohaib Asim - Dated 16-12-2020
    // Initialize Form
    this.hlthClmTypeForm = this.fb.group({
      hlthClmType: [0],
    }); 

    // Health Claim Types
    // Fetch Health Claim Types on Initiate
    if(this.hlthClmTypes == null ){
      this.toaster.info('Please Select Health Claim Type', 'Information');

      // 
      this.commonService.getHlthClmTypes().subscribe((res) => {
        this.hlthClmTypes = res;
        console.log("hlthClmTypes:", this.hlthClmTypes);   
      })
    }
    // End by Zohaib Asim

    if (this.auth.role != 'bm' && this.auth.role != 'bdo') {
      this.toaster.info('Please Select Branch', 'Information')

      this.commonService.getBrnchsForUsr().subscribe((res) => {
        this.branchs = res;
        console.log(res)
      })
    } else {
      this.onSelectBranch()
    }



  }

  get form() {
    return this.clientHealthInsuranceClaimForm.controls;
  }


  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadClms())
      )
      .subscribe();
  }

  // Added by Zohaib Asim - Dated 16-12-2020
  // Function for Health Claim Type changing
  onSelectHlthClmType(){
    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.onBranchSelection = false;
      this.clientHealthInsuranceClaims = [];
      this.dataSource = null;
      this.datalength = 0;
      this.searchVal = '';
      
      this.toaster.info('Please Select Branch', 'Information');
      return;
    }

    if (this.hlthClmTypeForm.controls['hlthClmType'].value == null || this.hlthClmTypeForm.controls['hlthClmType'].value == 0) {
      this.toaster.info('Please Select Health Claim Type', 'Information');
      this.onBranchSelection = false;
      this.clientHealthInsuranceClaims = [];
      this.dataSource = null;
      this.datalength = 0;
      this.searchVal = '';

      this.toaster.info('Please Select Health Claim Type', 'Information');
      return;
    }

    this.spinner.show()
    // Modified by Zohaib Asim - Dated 16-12-2020
    // Health Claim Type parameter added
    this.clientHealthInsuranceClaimService.getClientHealthInsuranceClaims(this.branchForm.controls['branch'].value, this.hlthClmTypeForm.controls['hlthClmType'].value,
    this.paginator.pageIndex, 10, "", this.isCount).subscribe(data => {
      this.clientHealthInsuranceClaims = data.clnts;
      this.spinner.hide();

      if (this.clientHealthInsuranceClaims.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.clientHealthInsuranceClaims);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      setTimeout(() => this.datalength = data.count, 10);

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
      console.log('err All client Health InsuranceClaims Service');
      console.log('err', error);
    });
  }
  // End by Zohaib Asim

  onSelectBranch() {
    this.isCount = true;

    this.clientHealthInsuranceClaims = [];
    this.dataSource = new MatTableDataSource(this.clientHealthInsuranceClaims);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.filterValue = '';
    this.lastPageIndex = 0;

    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.onBranchSelection = false;
      this.clientHealthInsuranceClaims = [];
      this.dataSource = null;
      this.datalength = 0;
      this.searchVal = '';
      return;
    }

    // Added by Zohaib Asim - Dated 16-12-2020
    //console.log("Branch Value :", this.branchForm.controls['branch'].value);
    //console.log("Health Claim Type Value :", this.hlthClmTypeForm.controls['hlthClmType'].value);
    // Health Claim Types Form
    if (this.hlthClmTypeForm.controls['hlthClmType'].value == null || this.hlthClmTypeForm.controls['hlthClmType'].value == 0) {
      this.toaster.info('Please Select Health Claim Type', 'Information');
      return;
    }

    this.spinner.show()
    // Modified by Zohaib Asim - Dated 16-12-2020
    // Health Claim Type parameter added
    //this.clientHealthInsuranceClaimService.getClientHealthInsuranceClaims(this.branchForm.controls['branch'].value, this.paginator.pageIndex, 10, "", this.isCount).subscribe(data => {
      this.clientHealthInsuranceClaimService.getClientHealthInsuranceClaims(this.branchForm.controls['branch'].value, this.hlthClmTypeForm.controls['hlthClmType'].value,
      this.paginator.pageIndex, 10, "", this.isCount).subscribe(data => {
      this.clientHealthInsuranceClaims = data.clnts;
      this.spinner.hide();

      if (this.clientHealthInsuranceClaims.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Branch', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.clientHealthInsuranceClaims);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      setTimeout(() => this.datalength = data.count, 10);

      this.dataBeforeFilter = this.dataSource.data;
      this.countBeforeFilter = data.count;
      this.lastPageIndexBeforeFilter = this.lastPageIndex;
    }, error => {
      this.spinner.hide();
      console.log('err All client Health InsuranceClaims Service');
      console.log('err', error);
    });
  }

  loadClms() {
    this.isCount = false;
    if (this.paginator.pageIndex < this.lastPageIndex)
      return
    if (this.dataSource.paginator.length == this.dataSource.data.length)
      return;

      if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
        this.toaster.info('Please Select Branch', 'Information');
        return;
      }
  
      if (this.hlthClmTypeForm.controls['hlthClmType'].value == null || this.hlthClmTypeForm.controls['hlthClmType'].value == 0) {
        this.toaster.info('Please Select Health Claim Type', 'Information');
        return;
      }

    if (((this.paginator.pageIndex + 1) * this.paginator.pageSize) - this.dataSource.data.length > 0) {
      this.spinner.show();
      // Modified by Zohaib Asim - Dated 16-12-2020
      // Health Claim Type parameter added
      //this.clientHealthInsuranceClaimService.getClientHealthInsuranceClaims(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, this.filterValue, this.isCount).subscribe(data => {
        this.clientHealthInsuranceClaimService.getClientHealthInsuranceClaims(this.branchForm.controls['branch'].value, this.hlthClmTypeForm.controls['hlthClmType'].value,
         this.paginator.pageIndex, this.paginator.pageSize, this.filterValue, this.isCount).subscribe(data => {

        this.spinner.hide();
        this.clientHealthInsuranceClaims = data.clnts;
        this.lastPageIndex = this.lastPageIndex + 1;
        this.dataSource.data = this.dataSource.data.concat(this.clientHealthInsuranceClaims);

        data.count = this.datalength;
        this.datalength = 0;
        setTimeout(() => { this.datalength = data.count; }, 10);

        if (this.clientHealthInsuranceClaims.length <= 0 && this.auth.role != 'bm' && this.branchForm.controls['branch'].value != 0) {
          this.toaster.info('No Data Found Against This Branch', 'Information')
        };
        if (this.filterValue.length == 0) {
          this.dataBeforeFilter = this.dataSource.data;
          this.countBeforeFilter = data.count;
          this.lastPageIndexBeforeFilter = this.lastPageIndex;
        }
      }, error => {
        this.spinner.hide();
        console.log('err All client Health InsuranceClaims Service');
        console.log('err', error);
      });

    }
  }

  getFilteredData(filterValue: string) {
    this.isCount = true;
    this.paginator.pageIndex = 0;
    this.lastPageIndex = 0;
    
    if (this.branchForm.controls['branch'].value == null || this.branchForm.controls['branch'].value == 0) {
      this.toaster.info('Please Select Branch', 'Information');
      return;
    }

    if (this.hlthClmTypeForm.controls['hlthClmType'].value == null || this.hlthClmTypeForm.controls['hlthClmType'].value == 0) {
      this.toaster.info('Please Select Health Claim Type', 'Information');
      return;
    }
    this.spinner.show();

    // Modified by Zohaib Asim - Dated 16-12-2020
    // Health Claim Type parameter added
    //this.clientHealthInsuranceClaimService.getClientHealthInsuranceClaims(this.branchForm.controls['branch'].value, this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe(data => {
    this.clientHealthInsuranceClaimService.getClientHealthInsuranceClaims(this.branchForm.controls['branch'].value, this.hlthClmTypeForm.controls['hlthClmType'].value,
       this.paginator.pageIndex, this.paginator.pageSize, filterValue, this.isCount).subscribe(data => {
      this.clientHealthInsuranceClaims = data.clnts;
      this.spinner.hide();

      if (this.clientHealthInsuranceClaims.length <= 0 && this.branchForm.controls['branch'].value != 0) {
        this.toaster.info('No Data Found Against This Search', 'Information')
      };

      this.dataSource = new MatTableDataSource(this.clientHealthInsuranceClaims);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.datalength = data.count;
    }, error => {
      this.spinner.hide();
      console.log('err All client Health InsuranceClaims Service');
      console.log('err', error);
    });
  }
  onSubmitBranchForm() {
    console.log(this.branchForm.value)
  }


  onAddNewClick() {
    this.clientHealthInsuranceClaimForm.reset();
    this.isEdit = false;
    this.addClientHealthInsuranceClaim = new ClientHealthInsuranceClaim();
    (<any>$('#businessector')).modal('show');
  }

  // addClientHealthInsuranceClaimSubmit() {
  //   this.submitted = true;
  //   if (this.clientHealthInsuranceClaimForm.invalid) {
  //     console.log(this.clientHealthInsuranceClaimForm);
  //     return;
  //   }
  //   this.addClientHealthInsuranceClaim = this.clientHealthInsuranceClaimForm.value;

  //   (<any>$('#ApplyPayment')).modal('hide');
  //   console.log(this.addClientHealthInsuranceClaim);
  //   if (this.isEdit) {
  //     this.clientHealthInsuranceClaimService.updateClientHealthInsuranceClaim(this.addClientHealthInsuranceClaim).subscribe(data => {
  //       this.addClientHealthInsuranceClaim = data;
  //       this.clientHealthInsuranceClaimService.getClientHealthInsuranceClaims().subscribe(data => this.clientHealthInsuranceClaims = data);

  //     });
  //   }
  //   else {
  //     this.clientHealthInsuranceClaimService.addClientHealthInsuranceClaim(this.addClientHealthInsuranceClaim).subscribe(data => {
  //       this.addClientHealthInsuranceClaim = data;
  //       this.clientHealthInsuranceClaimService.getClientHealthInsuranceClaims().subscribe(data => this.clientHealthInsuranceClaims = data);
  //     });
  //   }
  // }
  tempEditClientHealthInsuranceClaim;
  onPaymentClick(ClientHealthInsuranceClaim) {
    console.log(ClientHealthInsuranceClaim);
    this.expenseService.getClntOdDays(ClientHealthInsuranceClaim.clntSeq).subscribe((temp) => {
      console.log(temp['days'] !== 0);
      if (temp['days'] !== 0) {
        this.toaster.error("Client is in OD or has unposted Recovery.")
      }
      else {
        this.tempEditClientHealthInsuranceClaim = ClientHealthInsuranceClaim;

        (<any>$('#ApplyPayment')).modal('show');
        this.isEdit = true;
        this.clientHealthInsuranceClaimForm.patchValue(ClientHealthInsuranceClaim);
        this.clientHealthInsuranceClaimForm.controls.clmStsKey.setValue(this.findValueByKey(ClientHealthInsuranceClaim.clmStsKey))
        console.log(ClientHealthInsuranceClaim);
        this.addClientHealthInsuranceClaim = ClientHealthInsuranceClaim;

      }
    });

  }

  onDelete(ClientHealthInsuranceClaims) {
    console.log(ClientHealthInsuranceClaims)
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Claim?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.clientHealthInsuranceClaimService.deleteClientHealthInsuranceClaim(ClientHealthInsuranceClaims).subscribe(data => {
          this.spinner.hide();
          this.isCount = true;
          this.clientHealthInsuranceClaims = [];
          this.dataSource = new MatTableDataSource(this.clientHealthInsuranceClaims);
          this.paginator.pageIndex = 0;
          this.dataSource.paginator = this.paginator;
          this.searchVal = '';
          this.filterValue = '';
          this.lastPageIndex = 0;
          this.onSelectBranch();
        }, (error) => {
          this.spinner.hide();
          if (error.status == 500) {
            this.toaster.error("Something Went Wrong", "Error");
          } else if (error) {
            this.toaster.error("Something Went Wrong", "Error")
          }
        });
      }
    });

    console.log(ClientHealthInsuranceClaims);
  }
  findValueByKey(key) {
    let status = '';
    if (this.claimStatusArray) {
      this.claimStatusArray.forEach(s => {
        if (s.codeKey === key) {
          status = s.codeValue;
        }
      });
    }
    return status;
  }



  name: string;
  findClientName(seq) {
    this.clientHealthInsuranceClaimService.getClientName(seq).subscribe(data => this.name = data)
    return this.name;
  }

  exp:Expense= new Expense();
  temp:PaymentType= new PaymentType();
  onPayClick() {
    console.log(this.clientHealthInsuranceClaimForm)
    if (this.clientHealthInsuranceClaimForm.invalid) {
      return;
    }
    this.isCount = true;
    this.clientHealthInsuranceClaims = [];
    this.dataSource = new MatTableDataSource(this.clientHealthInsuranceClaims);
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.searchVal = '';
    this.filterValue = '';
    this.lastPageIndex = 0;
    this.spinner.show();

    this.clientHealthInsuranceClaimService.isClaimPaid(this.clientHealthInsuranceClaimForm.controls['clntHlthClmSeq'].value).subscribe(res => {
      if (!res.paid) {
        this.addClientHealthInsuranceClaim.clmStsKey = 1;
        this.addClientHealthInsuranceClaim.insturmentNum = this.form.instrumentNum.value;
        this.addClientHealthInsuranceClaim.paymentMode = this.form.paymentMode.value.typSeq;
        
        // Added by Zohaib Asim - Dated 23-12-2020
        // KSZB Claims
        this.addClientHealthInsuranceClaim.hlthClmTyp = this.hlthClmTypeForm.controls['hlthClmType'].value;
        // End by Zohaib Asim

        // this.clientHealthInsuranceClaimService.addClientHealthInsuranceClaimRecordInExpense(this.addClientHealthInsuranceClaim);

    if(this.addClientHealthInsuranceClaim.hlthClmTyp == 1){
      this.temp.typId='0343';
    } else if(this.addClientHealthInsuranceClaim.hlthClmTyp == 2){
      this.temp.typId='16227';
    } else if(this.addClientHealthInsuranceClaim.hlthClmTyp == 3){
      this.temp.typId='16226';
    }
    
    this.temp.typCtgryKey=2;
    this.temp.brnchSeq = 0;
    this.paymentTypesService.getTypeByIdAndCtgry(this.temp).subscribe(
      d => {
        this.temp = d;
        this.exp.pymtTypSeq = parseInt(this.addClientHealthInsuranceClaim.paymentMode);
        this.exp.brnchSeq = this.addClientHealthInsuranceClaim.brnchSeq;
        this.exp.expnsDscr = this.temp.typStr;
        this.exp.instrNum = this.addClientHealthInsuranceClaim.insturmentNum;
        this.exp.expnsAmt = this.addClientHealthInsuranceClaim.clmAmt;
        this.exp.expnsStsKey = 200;
        this.exp.expnsTypSeq = this.temp.typSeq;
        this.exp.pymtRctFlg = 1;
        this.exp.expRef=this.addClientHealthInsuranceClaim.clntHlthClmSeq;
        this.accessRecoveryService.addNewExpense(this.exp).subscribe(res => {
          this.toaster.success('Claim Paid', 'Success');
          if (this.clientHealthInsuranceClaims.indexOf(this.tempEditClientHealthInsuranceClaim) != -1) {
            this.clientHealthInsuranceClaims.splice(this.clientHealthInsuranceClaims.indexOf(this.tempEditClientHealthInsuranceClaim), 1);
          }
          this.clientHealthInsuranceClaimForm.reset();
          setTimeout(() => { this.getFilteredData(""), 300 });
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          if (error.status == 500) {
            this.toaster.error("Something Went Wrong", "Error");
          } else if (error) {
            this.toaster.error("Something Went Wrong", "Error")
          }
        });
       });
      } else {
        this.spinner.hide();
        this.toaster.error("This claim is already paid", "Error");
      }
    });
    this.spinner.hide();
    (<any>$('#ApplyPayment')).modal('hide');
  }

  onSelectChange() {
    let instrNum = this.clientHealthInsuranceClaimForm.get('instrumentNum');
    if (this.clientHealthInsuranceClaimForm.get('paymentMode').value.typId === '0001') {
      this.isCash = true;
      instrNum.clearValidators();
    } else {
      instrNum.setValidators(Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]));
      this.isCash = false;
    }
    instrNum.updateValueAndValidity();

  }

  onDeleteKszbClaim() {
    console.log('i am to delete')
  }
}