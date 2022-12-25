import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RecoveryStaging } from 'src/app/shared/models/recovery-staging.model';
import { FileLoaderService } from 'src/app/shared/services/file-loader.service';
import { PaymentType } from 'src/app/shared/models/paymentType.model';
import { MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';



@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit {

  public buttonDisabled: boolean;
  datePipeString : string;
  public filePath: any;
  public type: String;
  public recoveryStagingData: RecoveryStaging[];
  uploadFor: FormGroup;
  temp: string
  pt: PaymentType;
  totalRecv: number = 0;
  totalRecverr: number = 0;
  constructor(private datePipe: DatePipe,private fileLoaderService: FileLoaderService, private toaster: ToastrService, private fb: FormBuilder,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.uploadFor = this.fb.group({
      type: [''],
    });


    this.buttonDisabled = true;
  }

  onChange(deviceValue) {
    console.log(deviceValue);
  }
  isRec = false;
  onSelectedIndexChanged(selectedValue) {
    
    this.showValidate = true;
    this.isValidated = false;
    this.isRec = false;
    this.recoveryStagingData = null;
    this.totalRecv = 0;
    this.totalRecverr = 0;
    if (selectedValue == "Recovery") {
      this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/Recovery').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "/opt/RecoveryFile/ADC_FILE.csv")
          //          if(this.filePath=="C:\\Users\\Admin\\Desktop\\ADC_FILE.csv")
          {
            this.buttonDisabled = false;
            this.type = "Recovery";
            // NEED TO BE FIXED
            this.isRec = true;
            // this.validateResponse = { valid: true };
            // this.isValidated = true;
            //-fix till here
          }
          else {
            this.filePath = "File does not exist !!";
            this.buttonDisabled = true;
          }
        });
    }
    else if (selectedValue == "Budget") {
      this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/Budget').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "Budget";
            this.buttonDisabled = false;
          }

        });
    }
    else if (selectedValue == "Target") {
      this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/Target').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "Target";
            this.buttonDisabled = false;
          }
        });
    }
    else if (selectedValue == "Tagging") {
      this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/Tagging').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "Tagging";
            this.buttonDisabled = false;
          }
        });
    }
    else if (selectedValue == "InsuranceClaim") {
      this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/InsuranceClaim').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "InsuranceClaim";
            this.buttonDisabled = false;
          }
        });
    }

    else if (selectedValue == "WriteOff") {
      this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/WriteOff').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "WriteOff";
            this.buttonDisabled = false;
          }
        });
    } else if (selectedValue == "Funds") {
      this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/Funds').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "Funds";
            this.buttonDisabled = false;
          }
        });
    } else if (selectedValue == "Aml") {
      this.filePath = "https://scsanctions.un.org/resources/xml/en/consolidated.xml";
      this.buttonDisabled = false;
      this.isValidated = true;
      this.showValidate = false;
      this.type = "Aml";
      this.validateResponse = {"hasActiveJob": false, "valid": true, "list":[]}
    }else if (selectedValue == "defer") {
      this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/Defer').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "defer";
            this.buttonDisabled = false;
          }
        });
    }else if (selectedValue == "outreach") {
      this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/outreach').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "outreach";
            this.buttonDisabled = false;
          }
        });
     }else if(selectedValue == "BranchFundsRequest"){
        this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/BranchFundsRequest').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "BranchFundsRequest";
            this.buttonDisabled = false;
          }
        });
     }else if(selectedValue == "lifeInsuranceClaim"){
        this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/lifeInsuranceClaim').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "lifeInsuranceClaim";
            this.buttonDisabled = false;
          }
        });
     }else if(selectedValue == "branchWiseCMSFundsTransfer"){
        this.fileLoaderService.loadFilePath('/setupservice/api/load-file-path/branchWiseCMSFundsTransfer').subscribe(
        d => {
          this.filePath = d
          if (this.filePath == "File does not exist !!") {
            this.buttonDisabled = true;
          }
          else {
            this.type = "branchWiseCMSFundsTransfer";
            this.buttonDisabled = false;
          }
        });
     }
  }

  recValidated = false;
  getFileData() {
    this.recValidated = true;
    this.fileLoaderService.getFileData(this.type).subscribe(data => {
      this.recoveryStagingData = data;
      this.recoveryStagingData.forEach(element => {
        if (element.cmnt == null) {
          this.totalRecv = this.totalRecv + element.amt;
        }
        if (element.cmnt != null) {
          this.totalRecverr = this.totalRecverr + element.amt;
        }
        this.fileLoaderService.getClientAndBranchName(element.clntId).subscribe(d => {
          this.temp = d
          console.log(d);
          element.clntNm = this.temp.split('+')[0];
          element.branchNm = this.temp.split('+')[1];

          this.fileLoaderService.getAgent(element.agentId).subscribe(res => {
            const da: PaymentType = res;
            element.agentName = da.typStr;
          });

        });

      });
    });
  }
  resetFile() {
    this.uploadFor.reset();
    this.type = "";
    this.buttonDisabled = true;
    this.filePath = "";
  }
  allFunds: any;
  showValidate = true;
  uploadFile() {
    this.uploadFor.reset();
    setTimeout(()=>{this.spinner.show();}, 5)
    this.fileLoaderService.uploadFile(this.type).subscribe(d => {
      this.spinner.hide();
      this.toaster.success("Successfully Processed");
      if (this.type == "Recovery") {
        setTimeout(()=>{this.spinner.show();}, 5)
        // this.getFileData();
        this.fileLoaderService.postData().subscribe(r => {
          this.spinner.hide();
          swal({
            title: 'Recovery Posting Status',
            text: r['success'],
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          })
          .then((result) => {
            if (result.value) {
            }
          });
          
        }, error => {

        });
      }
      else if (this.type == "Funds") {
        this.allFunds = d;
        this.fileLoaderService.postFundsData().subscribe(r => {

        }, error => {

        });
      }else if (this.type == "Aml") {
        console.log(d);
        d.forEach(e=>{
          e.valid = true;
          e.reason = "";
        })
          this.spinner.hide();
          this.columns = [
            { name: 'amlDataId', label: 'Data ID' },
            { name: 'frstNm', label: 'First Name' },
            { name: 'scndNm', label: 'Second Name' },
            { name: 'thrdNm', label: 'Third Name' },
            { name: 'cmnts', label: 'Comments' },
            { name: 'valid', label: 'Valid' },
            { name: 'reason', label: 'Reason' }
          ];
          this.dataSource = new MatTableDataSource(d);
          this.displayedColumns = this.columns.map(column => column.name);
      }else if(this.type == "branchWiseCMSFundsTransfer"){
          this.allFunds = d;
      } else {
        // this.toaster.success(d + "");
      }

    }, error => {
      this.spinner.hide();

      this.toaster.error("Something Went Wrong");
    }
    );
    this.filePath = null;
    this.buttonDisabled = true;


  }

  postFile() {
    console.log("@@@@@")
    // this.spinner.show();

    // setTimeout(() => {
    //   this.spinner.hide();
    //   this.toaster.show("Posted");
    //   this.recValidated = false;
    // }, 6000);
    this.fileLoaderService.postData().subscribe();
  }
  postFunds() {
    this.fileLoaderService.postFundsData().subscribe(res=>{
      this.toaster.success("Funds Posted")
    });
  }

  postBranchCMSFunds() {
    setTimeout(() => {
      this.spinner.show();
    }, 5);
    this.fileLoaderService.postBranchCMSFundsData(this.allFunds).subscribe(res=>{
      this.spinner.hide();
      this.toaster.success("Branch CMS Funds Transfer")
      this.allFunds = [];
    }, error => {
      this.spinner.hide();
      this.toaster.error("Something Went Wrong");
    });
  }

  
  activeJob; job;
  isValidated = false; validateResponse;
  getTotalClients() {
    return this.validateResponse['list'] != undefined ? this.validateResponse['list'].length : 0
  }
  getTotalAmount() {
    let x = 0;
    if(this.validateResponse['list'] != undefined){
      this.validateResponse['list'].forEach(d => {
        if (d.amt != undefined && d.amt != null) {
          x += +d.amt;
        }
      })
    }
    return x;
  }
  getTotalAmount1() {
    let x = 0;
    if(this.validateResponse['list'] != undefined){
      this.validateResponse['list'].forEach(d => {
        if (d.amount != undefined && d.amount != null) {
          x += +d.amt;
        }
      })
    }
    return x;
  }
  insrClmsTotal=0;
  validate() {
    console.log(this.uploadFor.controls['type'].value);
    if (this.uploadFor.controls['type'].value == "Budget") {
      this.spinner.show();
      this.fileLoaderService.validateBudgetFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        this.columns = [
          { name: 'header', label: 'Budget GL Header' },
          { name: 'type', label: 'Budget Type' },
          { name: 'category', label: 'Budget Category' },
          { name: 'period', label: 'Period' },
          { name: 'year', label: 'Year' },
          { name: 'amount', label: 'Amount' },
          { name: 'branch', label: 'Branch' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
        // if()
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    } else if (this.uploadFor.controls['type'].value == "Target") {
      this.spinner.show();
      this.fileLoaderService.validateTargetFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        this.columns = [
          { name: 'year', label: 'Year' },
          { name: 'period', label: 'Period' },
          { name: 'branch', label: 'Branch' },
          { name: 'prdGrp', label: 'Product ID' },
          { name: 'clients', label: 'No. Of Clients' },
          { name: 'amount', label: 'Amount' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    } else if (this.uploadFor.controls['type'].value == "Tagging") {
      this.spinner.show();
      this.fileLoaderService.validateTaggingFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        this.columns = [
          { name: 'clientSeq', label: 'Client Seq' },
          { name: 'tagSeq', label: 'Tag Seq' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    } else if (this.uploadFor.controls['type'].value == "InsuranceClaim") {
      this.spinner.show();
      this.insrClmsTotal = 0;
      this.fileLoaderService.validateClaimsFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        res['list'].forEach(obj => {
          obj.clntName = obj.firstName + " " + obj.lastName;
          this.insrClmsTotal = this.insrClmsTotal + +obj.amount;
        })
        this.columns = [
          { name: 'regname', label: 'Region' },
          { name: 'areaName', label: 'Area' },
          { name: 'brnchName', label: 'Branch' },
          { name: 'active', label: 'Claim Type' },
          { name: 'claim', label: 'Claim #' },
          { name: 'client', label: 'Client ID' },
          { name: 'clntName', label: 'Client Name' },
          { name: 'amount', label: 'Amount' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' },
          // Added by Zohaib Asim - Dated 17-12-2020
          // Health Claim Type
          { name: 'healthClaimType', label: 'Health Claim Type'}
        ];
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    } else if (this.uploadFor.controls['type'].value == "WriteOff") {
      this.spinner.show();
      this.fileLoaderService.validateWriteOffFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        console.log(this.validateResponse)
        this.columns = [
          { name: 'branch', label: 'Branch' },
          { name: 'product', label: 'Product' },
          { name: 'client', label: 'Client ID' },
          { name: 'loan', label: 'Loan App Seq' },
          { name: 'disbDate', label: 'Disbursement Date' },
          { name: 'recAmount', label: 'Recovered Amount' },
          { name: 'odAmount', label: 'Overdue Amount' },
          { name: 'odDays', label: 'Overdue Days' },
          { name: 'outstanding', label: 'Outstanding' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];
        console.log(res['list'])
        res['list'].forEach(obj => {
          // obj.clntName = ((obj.firstName != undefined) ? obj.firstName : "") + " " + ((obj.lastName != undefined) ? obj.lastName : "");
          obj.date = this.datePipe.transform(obj.date,'dd-MM-yyyy');
        })
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    } else if (this.uploadFor.controls['type'].value == "Funds") {
      this.fundsTotal = 0;
      this.spinner.show();
      this.fileLoaderService.validateFundsFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        this.columns = [
          { name: 'branch', label: 'Branch' },
          { name: 'funds', label: 'Funds' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];

        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
        res['list'].forEach(ele=>{
          this.fundsTotal = this.fundsTotal + +ele.funds;
        })
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    }else if (this.uploadFor.controls['type'].value == "defer") {
      this.spinner.show();
      this.fileLoaderService.validateDeferFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        this.columns = [
          { name: 'clntName', label: 'Clnt Name' },
          { name: 'clntId', label: 'Client Id' },
          { name: 'loanAppSeq', label: 'Credit Seq' },
          { name: 'loanSts', label: 'Status' },
          { name: 'instNum', label: 'Paid Inst.' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];

        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
        // res['list'].forEach(ele=>{
        //   this.fundsTotal = this.fundsTotal + +ele.funds;
        // })
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    }
    else if (this.uploadFor.controls['type'].value == "Recovery") {
      this.spinner.show();
      this.fileLoaderService.validateRecoveryFile().subscribe(res => {
        console.log(res)
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        if (res['hasActiveJob'] == true) {
          return;
        }

        if( res['list'] != undefined){
          res['list'].forEach(obj => {
            obj.clntName = ((obj.firstName != undefined) ? obj.firstName : "") + " " + ((obj.lastName != undefined) ? obj.lastName : "");
            obj.date = this.datePipe.transform(obj.date,'dd-MM-yyyy');
          })
        }
        this.columns = [
          { name: 'transNum', label: 'Transaction No.' },
          { name: 'clntId', label: 'Client ID' },
          { name: 'clntName', label: 'Name' },
          { name: 'amt', label: 'Recovery Amount' },
          { name: 'date', label: 'Date' },
          { name: 'agntId', label: 'Agent ID' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    }
    else if(this.uploadFor.controls['type'].value == "outreach"){

      this.fileLoaderService.validateOutreachFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        if (res['hasActiveJob'] == true) {
          return;
        }
        this.columns = [
          { name: 'region', label: 'Region Seq' },
          { name: 'opening', label: 'Opening' },
          { name: 'targets', label: 'Targets' },
          { name: 'client', label: 'Maturing Clients' },
          { name: 'outreach', label: 'Closing Outreach' },
          { name: 'month', label: 'Month' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    }
    /**
    * @Added, Naveed
    * @Date, 14-06-2022
    * @Description, SCR - systemization Funds Request
    */
    else if(this.uploadFor.controls['type'].value == "BranchFundsRequest"){

      this.fileLoaderService.validateBranchFundsRequestFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        if (res['hasActiveJob'] == true) {
          return;
        }
        this.columns = [
          { name: 'regNm', label: 'Region Sequence' },
          { name: 'brnchNm', label: 'Branch Sequence' },
          { name: 'expAmt', label: 'Amount' },
          { name: 'expDscr', label: 'Purpose' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    }

    else if(this.uploadFor.controls['type'].value == "lifeInsuranceClaim"){
      setTimeout(() => {
        this.spinner.show();
      }, 5);
      this.fileLoaderService.validateLifeInsuranceClaimFile().subscribe(res => {
        this.spinner.hide();
        this.isValidated = true;
        this.validateResponse = res;
        if (res['hasActiveJob'] == true) {
          return;
        }
        this.columns = [
          { name: 'clientId', label: 'Client' },
          { name: 'clientName', label: 'Client Name' },
          { name: 'clientCnic', label: 'Client Cnic' },
          { name: 'nomineeName', label: 'Nominee Name' },
          { name: 'nomineeCnic', label: 'Nominee Cnic' },
          { name: 'productName', label: 'Product Name' },
          { name: 'branchName', label: 'Branch Name' },
          { name: 'deathDate', label: 'Death Date' },
          { name: 'insuranceNum', label: 'Insurance Number' },
          { name: 'insuranceClaimDate', label: 'Insurance Claim Date' },
          { name: 'approveDate', label: 'Approve Date' },
          { name: 'adjusAmt', label: 'Adjustment Amount' },
          { name: 'valid', label: 'Valid' },
          { name: 'reason', label: 'Reason' }
        ];
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
      }, error => {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong");
      })
    }

    /**
    * @Added, Naveed
    * @Date, 14-07-2022
    * @Description, SCR - Branch Wise CMS funds transfer
    */
      else if(this.uploadFor.controls['type'].value == "branchWiseCMSFundsTransfer"){
        setTimeout(() => {
          this.spinner.show();
        }, 5);
        this.fundsTotal = 0;
        this.fileLoaderService.validateBranchCMSFundsTransferFile().subscribe(res => {
          this.spinner.hide();
          this.isValidated = true;
          this.validateResponse = res;
          if (res['hasActiveJob'] == true) {
            return;
          }
          this.columns = [
            { name: 'branchSeq', label: 'Branch Sequence' },
            { name: 'amount', label: 'Amount' },
            { name: 'instNum', label: 'Instrument Number' },
            { name: 'narration', label: 'Narration' },
            { name: 'valid', label: 'Valid' },
            { name: 'reason', label: 'Reason' }
          ];
        this.dataSource = new MatTableDataSource(res['list']);
        this.displayedColumns = this.columns.map(column => column.name);
        res['list'].forEach(ele=>{
          this.fundsTotal = this.fundsTotal + +ele.amount;
        })
        }, error => {
          this.spinner.hide();
          this.toaster.error("Something Went Wrong");
        })
      }

  }
  dataSource;
  columns: Array<any> = [];
  displayedColumns: string[] = this.columns.map(column => column.name);
  fundsTotal = 0;
}
