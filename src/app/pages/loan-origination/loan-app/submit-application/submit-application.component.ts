import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../../../shared/services/loan.service';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoanProduct } from '../../../../shared/models/LoanProduct.model';
import { CommonService } from '../../../../shared/services/common.service';
import { LoanApplicant } from '../../../../shared/models/LoanApplicant.model';
import { BusinessAppraisal } from '../../../../shared/models/BusinessAppraisal.model';
import { Auth } from '../../../../shared/models/Auth.model';
import * as REF_CD_GRP_KEYS from '../../../../shared/models/REF_CODE_GRP_KEYS.mocks';
import { SchoolGradeDto } from '../../../../shared/models/schoolAppraisal.model';
import { DomSanitizer } from '@angular/platform-browser';
import swal from 'sweetalert2';
import { VehicleLoansService } from 'src/app/shared/services/vehicle-loans.service';

@Component({
  selector: 'app-submit-application',
  templateUrl: './submit-application.component.html',
  styleUrls: ['./submit-application.component.css']
})

export class SubmitApplicationComponent implements OnInit {
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;
  model: any; formSaved = false;
  products: LoanProduct[] = [];
  application: any = new LoanApplicant();
  product: LoanProduct = new LoanProduct();
  locationInfo: LocationInfo = new LocationInfo();
  isNomDetailAvailable: boolean;
  auth: Auth; loanAppSeq;
  commentsArray = [];
  clientNomineeData: any;
  clientInsuranceData: any;
  constructor(private router: Router,
    private loanService: LoanService
    , private breadcrumbProvider: BreadcrumbProvider, private spinner: NgxSpinnerService
    , private commonService: CommonService, private toaster: ToastrService,
    public sanitizer: DomSanitizer,
    private vehicleLoansService: VehicleLoansService) { }

  hasBusinessApp: boolean = false;
  titleValue = "Credit";

  ngOnInit() {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem("basicCrumbs"));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, "/loan-origination/app/" + element.formUrl, element.isSaved);
    });

    this.model = JSON.parse(sessionStorage.getItem('model'));

    if(this.model.loanProdGrp == 6 || this.model.loanProdGrp == 24){
      this.titleValue = "Murabaha";
    }

    this.model.nominee.loanAppSeq = this.model.loanAppSeq;
    this.model.nominee.formSeq = this.model.formSeq;
    this.model.nominee.clientSeq = this.model.clientSeq;
    if (this.model.isNomDetailAvailable)
      this.model.nominee.typFlg = 1;
    else
      this.model.nominee.typFlg = 2;
    console.log(this.model.loanAppSeq);
    console.log(this.model);
    console.log(this.model.nominee)

    this.loanService.getClntRel(this.model.nominee).subscribe((res) => {
      console.log(res);
      this.clientNomineeData = res;
      console.log(this.clientNomineeData.relationKey)
      console.log(this.clientNomineeData.relationKey)
    });

    this.loanService.getInsuranceMembers(this.model.loanAppSeq).subscribe((res) => {
      console.log(res);
      this.clientInsuranceData = res;
    });

    this.isNomDetailAvailable = this.model.isNomDetailAvailable;
    this.loanAppSeq = this.model.loanAppSeq;
    if (this.model.forms) {
      let hasboth = false;
      this.model.forms.forEach(element => {
        if (element.formUrl == 'nominee') {
          this.model.forms.forEach(form => {
            if (form.formUrl == 'next-of-kin') {
              hasboth = true;
              form.hasNextOfKin = true;
              element.hasNextOfKin = true;
              hasboth = true;
            }
          })
        }
      });
      this.model.forms.forEach(
        (element, index) => {
          if ((element.formUrl === 'co-borrower' && this.model.selfPDC) || (element.formUrl === 'co-borrower' && this.model.isSAN)) {
            element.isSaved = true;
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
          } else if (element.formUrl == "mfcib" || element.formUrl == "documents") {
            element.isSaved = true;
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
          } else if (element.formUrl == 'next-of-kin') {
            if (hasboth) {
              this.model.hasNextOfKin = true;
              if (this.model.isNomDetailAvailable == true || this.model.isNomDetailAvailable == undefined) {
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
              } else {

                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
              }
            } else {
              this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
            }
          } else if (element.formUrl == 'nominee') {
            if (hasboth) {
              this.model.hasNextOfKin = true;
              if (this.model.isNomDetailAvailable == false || this.model.isNomDetailAvailable == undefined) {
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, true);
              } else {
                this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
              }
            } else {
              this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
            }
          } else {
            this.breadcrumbProvider.addCheckedItemDis(element.formNm, '/loan-origination/app/' + element.formUrl, element.isSaved, false);
          }
          if ('/loan-origination/app/' + element.formUrl === this.router.url) {
            this.model.formSeq = element.formSeq;
          }
        }
      );
    }
    if (this.model.businessAppraisal == undefined)
      this.model.businessAppraisal = new BusinessAppraisal(this.model.loanAppSeq, this.model.formSeq);

    this.loanService.getLoanAppForSubmit(this.model.loanAppSeq).subscribe((res) => {
      this.spinner.hide();
      this.application = res;

      if (res.clntInfo != null)
        this.model = Object.assign(this.model, res.clntInfo, this.model);
      if (res.BusinessApraisal != null) {
        Object.assign(this.model.businessAppraisal, res.BusinessApraisal, this.model.businessAppraisal); this.hasBusinessApp = true;
      }
      if (res.loanApp != null)
        this.model = Object.assign(this.model, res.loanApp, this.model);

      if (res.loanApp != null && res.loanApp.comment != null && res.loanApp.comment != "") {
        try {
          this.commentsArray = JSON.parse(res.loanApp.comment);
        }
        catch (err) {
          console.log(err)
        }
      }


      if (res.BusinessIncome != null)
        Object.assign(this.model.businessAppraisal, res.BusinessIncome, this.model.businessAppraisal);

      this.locationInfo = new LocationInfo();
      if (res.locationInfo != null)
        Object.assign(this.locationInfo, res.locationInfo, this.locationInfo);
      this.calculateTotalValues();
      this.loadLovs();
      console.log(this.commentsArray)
      if (this.model.businessAppraisal.isbizAddrSAC) {
        this.model.businessAppraisal.houseNum = this.model.houseNum;
        this.model.businessAppraisal.sreet_area = this.model.sreet_area;
        this.model.businessAppraisal.village = this.model.village;
        this.model.businessAppraisal.otherDetails = this.model.otherDetails;
      }
      //Added by Areeba
      if (this.model.businessAppraisal.activityKey != null && this.model.businessAppraisal.activityKey != 0 && this.model.businessAppraisal.activityKey != undefined) {
        this.loanService.getBusinessActyForActySeq(this.model.businessAppraisal.activityKey).subscribe((res) => {
          if (res.length > 0) {
            this.model.businessAppraisal.sectorKey = res[0].bizSectSeq;
          }
        })
      }
      //Ended by Areeba
    }, (error) => {
      this.spinner.hide();
      // this.toaster.error("Unable to Get Data");
      console.log("error", error);
    });

    this.loanService.getProducts(this.model).subscribe((res) => {
      this.spinner.hide();
      this.products = res;
      this.products.forEach(element => {
        if (element.productSeq == this.model.loanProd) {
          this.product = element;
        }
      });
      this.onProductSelect(this.model.loanProd);
    }, (error) => {
      this.spinner.hide();
      console.log(error);
    });

    this.loanService.getSchoolApperaisal(this.model.loanAppSeq).subscribe((schoolAP: any) => {
      if (schoolAP != undefined && schoolAP.schAprslSeq != 0) {
        this.model.schoolAppraisal = schoolAP;
        this.hasSchoolApp = true;
      }
      if (this.model.schoolAppraisal != undefined) {
        this.hasSchoolApp = true;
        this.calculateTotalGrades();
      }
    }, (error) => {
      console.log(error)
    });
    this.calculateTotalExpense();
    this.loadLovs();
  }

  totalExpense: any;
  calculateTotalExpense() {
    this.totalExpense = 0;
    for (let i = 0; i < this.model.loanUtilization.length; i++) {
      const x = +this.model.loanUtilization[i].loanUtilAmount;
      this.totalExpense = this.totalExpense + x;
      console.log("totalExpense",this.totalExpense);
    }
  }
  totalmnths: number; hasSchoolApp = false;
  calculateTotalMonth() { this.totalmnths = Math.floor((this.model.businessAppraisal.yearsInBusiness * 12) + this.model.businessAppraisal.monthsInBusiness); }
  totalHouseholdExpense = 0;
  totalBusinessExpense = 0;
  totalSecondaryIncome = 0;
  totalPrimaryIncome = 0;

  calculateTotalValues() {
    this.calculateTotalMonth();
    this.totalPrimaryIncome = 0;
    for (let i = 0; i < this.model.businessAppraisal.primaryIncome.length; i++) {
      const x = +this.model.businessAppraisal.primaryIncome[i].incomeAmount;
      this.totalPrimaryIncome = this.totalPrimaryIncome + x;
    }
    this.totalSecondaryIncome = 0;
    for (let i = 0; i < this.model.businessAppraisal.secondaryIncome.length; i++) {
      const x = +this.model.businessAppraisal.secondaryIncome[i].incomeAmount;
      this.totalSecondaryIncome = +this.totalSecondaryIncome + x;
    }
    this.totalBusinessExpense = 0;
    for (let i = 0; i < this.model.businessAppraisal.businessExpense.length; i++) {
      const x = +this.model.businessAppraisal.businessExpense[i].expAmount;
      this.totalBusinessExpense = +this.totalBusinessExpense + x;
    }
    this.totalHouseholdExpense = 0;
    for (let i = 0; i < this.model.businessAppraisal.householdExpense.length; i++) {
      const x = +this.model.businessAppraisal.householdExpense[i].expAmount;
      this.totalHouseholdExpense = +this.totalHouseholdExpense + x;
    }
    this.incomeChange();
  }

  averageIncome = 0;
  incomeChange() {
    this.averageIncome = Math.floor(((this.model.businessAppraisal.maxMonthSale * this.model.businessAppraisal.maxSaleMonth) + (this.model.businessAppraisal.minMonthSale * this.model.businessAppraisal.minSaleMonth)) / (this.model.businessAppraisal.minSaleMonth + this.model.businessAppraisal.maxSaleMonth));
    this.calculateNetDeposible();
    this.calculateBusinessProfit();
  }
  netDeposible = 0;
  calculateNetDeposible() {
    this.netDeposible = this.totalPrimaryIncome + this.totalSecondaryIncome + this.averageIncome - this.totalBusinessExpense - this.totalHouseholdExpense;
  }
  businessProfit = 0;
  calculateBusinessProfit() {
    this.businessProfit = this.totalPrimaryIncome - this.totalBusinessExpense;
  }

  onProductSelect(val) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].productSeq == val) {
        this.product = this.products[i];
        break;
      }
    }
    this.onRecommendAmountChange();
  }

  //Modified by Areeba
  onRecommendAmountChange() {
    this.product.charges.forEach(charge => {
      // if (charge.type == 1) { 
      //   this.product.totalRecieveable = Math.floor((+this.model.recAmount) + (+charge.charge * +this.model.recAmount) / 100);
      //   console.log(+charge.charge);
      //   console.log(+this.model.recAmount);
      //   this.product.chargesStr = "" + ((+charge.charge * +this.model.recAmount) / 100);
      // }
      // else {
      //   this.product.totalRecieveable = Math.floor(+this.model.recAmount + +charge.charge);
      //   this.product.chargesStr = "" + +charge.charge;
      // }
      if (charge.type == 2) {
        let totalCharge = 0;
        if (charge.slbs != null && charge.slbs != undefined) {
          let totalAmount = +this.model.recAmount;
          let remainingAmount = +this.model.recAmount;
          charge.slbs.forEach(slb => {
            if (+this.model.recAmount > +slb.startLmt) {
              if (slb.endLmt != null) {
                remainingAmount = remainingAmount - (+slb.endLmt);
                let chrgeAmt = Math.round(((+slb.endLmt - +slb.startLmt) * +slb.val) / 100);
                totalCharge = totalCharge + chrgeAmt;
              } else {
                let chrgeAmt = Math.round((remainingAmount * +slb.val) / 100);
                totalCharge = totalCharge + chrgeAmt;
              }
            }
          })
        }
        this.product.totalRecieveable = Math.floor((+this.model.recAmount) + totalCharge);
        this.product.chargesStr = "" + totalCharge;
      }
      else {
        let totalCharge = 0;
        if (charge.slbs != null && charge.slbs != undefined) {
          let totalAmount = +this.model.recAmount;
          let remainingAmount = +this.model.recAmount;
          charge.slbs.forEach(slb => {
            console.log(+this.model.recAmount > +slb.startLmt)
            if (+this.model.recAmount > +slb.startLmt) {
              if (slb.endLmt != null) {
                remainingAmount = remainingAmount - (+slb.endLmt);
                let chrgeAmt = Math.round(((+slb.endLmt - +slb.startLmt) + +slb.val));
                totalCharge = totalCharge + chrgeAmt;
                console.log("11")
              } else {
                let chrgeAmt = Math.round((remainingAmount + slb.val));
                totalCharge = totalCharge + chrgeAmt;
                console.log(totalCharge)
              }
            }
          })
        }
        this.product.totalRecieveable = Math.floor(+this.model.recAmount + +charge.charge);
        this.product.chargesStr = "" + totalCharge;
      }
    })
  }
  cpPercentage: string;
  onPersonelChange() {
    let p = this.findValueFromKey(this.model.businessAppraisal.personRunningBusinessKey, this.businessRunner);
    if (p == 'SELF') {
      this.cpPercentage = '100%';
    } else {
      this.cpPercentage = '50%';
    }
  }
  convertToDateString(str: string) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = new Date(str);
    let datestr = date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear();
    return datestr;
  }




  education: any;
  occupation: any;
  gender: any;
  maritalStatus: any;
  disability: any;
  residenceArray: any = [];
  communityArray: any;
  sector: any;
  businessRunner: any;
  businessOwnership; any; principal; schoolOwnerShip; schoolType;
  rejectionReasons;
  loadLovs() {
    // this.commonService.getValues('EDUCATION').subscribe((res) => {
    //   this.education = res;
    // }, (error) => {
    //   console.log('err', error);
    // });
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_TYPE).subscribe(d => this.schoolType = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_OWNERSHIP).subscribe(d => this.schoolOwnerShip = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.SCHOOL_PRINCIPAL).subscribe(d => this.principal = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.REJECTION_REASON_CODE).subscribe(d => this.rejectionReasons = d);
    this.commonService.getValues(REF_CD_GRP_KEYS.OCCUPATION).subscribe((res) => {
      this.occupation = res;
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.GENDER).subscribe((res) => {
      this.gender = res;
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getValues(REF_CD_GRP_KEYS.MARITAL_STATUS).subscribe((res) => {
      this.maritalStatus = res;
    }, (error) => {
      console.log('err', error);
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.BUSINESS_RUNNER).subscribe((res) => {
      this.businessRunner = res;
      this.onPersonelChange();
    }, (error) => {
      console.log('err', error);
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.BUSINESS_OWNERSHIP).subscribe((res) => {
      this.businessOwnership = res;
    }, (error) => {
      console.log('err', error);
    });
    this.commonService.getValues(REF_CD_GRP_KEYS.RESIDENCE).subscribe((res) => {
      this.residenceArray = res;
      console.log(res);
    }, (error) => {
      console.log('err', error);
    });

    this.commonService.getSectors(this.model.loanProd).subscribe((res) => {
      this.sector = res;
    }, (error) => {
      console.log('err', error);
    });

    this.loanService.getAllDocumentsForLoanApp(this.model.loanAppSeq).subscribe(res => {
      console.log(res)
      this.docs = res;
      this.docs.forEach(d => {
        if (d.docSeq == 1)
          this.clientPic = d.docImg;
        if (d.docSeq == 4)
          this.nomPic = d.docImg;
      })
    })
  }
  docs: any[] = [];
  clientPic = null;
  nomPic = null;
  returnCNICPattern(cnic) {
    let string = '';
    let str = cnic + "";
    let charArray = str.split("");
    charArray.forEach((item, index) => {
      if (index == 5 || index == 12)
        string = string + '-';
      string = string + item;
    });
    return string;
  }
  findValueFromKey(key, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].codeKey == key) {
          return array[i].codeValue;
        }
      }
    }
  }

  findValueFromKeySector(key, array) {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].bizSectSeq == key) {
          return array[i].bizSectNm;
        }
      }
    }
  }
  totalGrade;
  private calculateTotalGrades() {
    this.totalGrade = new SchoolGradeDto();
    if (this.model.schoolAppraisal.schoolGradeDtos != null && this.model.schoolAppraisal.schoolGradeDtos != undefined) {
      this.model.schoolAppraisal.schoolGradeDtos.forEach(g => {
        this.totalGrade.avgFee = this.totalGrade.avgFee + Number.parseInt(g.avgFee);

        this.totalGrade.totFemStdnt = this.totalGrade.totFemStdnt + Number.parseInt(g.totFemStdnt);
        this.totalGrade.totMaleStdnt = this.totalGrade.totMaleStdnt + Number.parseInt(g.totMaleStdnt);
        this.totalGrade.noFeeStdnt = this.totalGrade.noFeeStdnt + Number.parseInt(g.noFeeStdnt);
        this.totalGrade.femStdntPrsnt = this.totalGrade.femStdntPrsnt + Number.parseInt(g.femStdntPrsnt);
        this.totalGrade.maleStdntPrsnt = this.totalGrade.maleStdntPrsnt + Number.parseInt(g.maleStdntPrsnt);
        // this.totalGrade.classAverageFee = this.totalGrade.avgFee / this.model.schoolAppraisal.schoolGradeDtos.length;
        this.totalGrade.girlsAverage = (this.totalGrade.totFemStdnt / (this.totalGrade.totFemStdnt + this.totalGrade.totMaleStdnt)) * 100;
        this.totalGrade.totalFee = this.totalGrade.classAverageFee;
        this.totalGrade.totalStudents = this.totalGrade.totFemStdnt + this.totalGrade.totMaleStdnt;
        let classRevenue = Math.round(((+g.totFemStdnt + +g.totMaleStdnt) - (+g.noFeeStdnt)) * (+g.avgFee));
        this.totalGrade.schoolRevenue += classRevenue;
        this.totalGrade.classAverageFee = Math.round(this.totalGrade.schoolRevenue / this.totalGrade.totalStudents);
      });
    }
    if (this.model.schoolAppraisal.businessExpense != undefined && this.model.schoolAppraisal.businessExpense != null) {
      this.totalGrade.totalBusinessExpense = 0;
      this.model.schoolAppraisal.businessExpense.forEach(ex => {
        this.totalGrade.totalBusinessExpense = this.totalGrade.totalBusinessExpense + +ex.expAmount;
      })
    }

    if (this.model.schoolAppraisal.primaryIncome != undefined && this.model.schoolAppraisal.primaryIncome != null) {
      this.totalGrade.totalPrimaryIncome = 0;
      this.model.schoolAppraisal.primaryIncome.forEach(inc => {
        this.totalGrade.totalPrimaryIncome = this.totalGrade.totalPrimaryIncome + +inc.incomeAmount;
      })
    }

    if (this.model.schoolAppraisal.secondaryIncome != undefined && this.model.schoolAppraisal.secondaryIncome != null) {
      this.totalGrade.totalSecondaryIncome = 0;
      this.model.schoolAppraisal.secondaryIncome.forEach(inc => {
        this.totalGrade.totalSecondaryIncome = this.totalGrade.totalSecondaryIncome + +inc.incomeAmount;
      })
    }

    if (this.model.schoolAppraisal.householdExpense != undefined && this.model.schoolAppraisal.householdExpense != null) {
      this.totalGrade.totalHouseholdExpense = 0;
      this.model.schoolAppraisal.householdExpense.forEach(ex => {
        this.totalGrade.totalHouseholdExpense = this.totalGrade.totalHouseholdExpense + +ex.expAmount;
      })
    }
  }

  addCommentsToModel() {
    // let array;
    // if (this.comment.length > 0) {
    //   let obj: any = {
    //     username: this.auth.user.username,
    //     date: new Date(),
    //     comment: this.comment,
    //     role: this.auth.role
    //   }
    //   this.commentsArray.push(obj);

    //   if (this.model.comment == null || this.model.comment == undefined) {
    //     array = [];
    //     array.push(obj);
    //   } else {
    //     if (this.model.comment.length > 0) {
    //       console.log(this.model.comment.length)
    //       array = JSON.parse(this.model.comment);
    //       console.log(array)
    //       array.push(obj);
    //     } else {
    //       array = [];
    //       array.push(obj);
    //     }
    //   }
    //   this.model.comment = JSON.stringify(array);
    //   this.comment = "";
    // }

    this.model.comment = this.comment;
  }

  comment: string = "";
  submitApplication() {
    this.model.loanAppSeq = this.loanAppSeq;
    console.log(this.clientNomineeData);
    // if (this.clientNomineeData.relationKey == 545 && ) {

    // }
    // this.clientInsuranceData.forEach(ele => {
    //   if (ele.relKey == 434 && this.clientNomineeData.relationKey == 545) {
    //     this.toaster.info('Duplicate Husbands cannot be added, Please remove one record', "Information");
    //     return;
    //   }
    // })

    for (let a = 0; a < this.clientInsuranceData.length; a++) {
      if (this.clientInsuranceData[a].relKey == 434 && this.clientNomineeData.relationKey == 545 && this.model.loanProd == 4) {
        this.toaster.info('Duplicate Husbands cannot be added, Please remove one record', "Information");
        return;
      }
    }

    var keepGoing = true;
    if (this.model.forms) {
      this.model.forms.forEach(element => {
        if (keepGoing) {
          if (!element.isSaved) {
            if (element.formNm != "Documents" && element.formNm != "Submit Application") {
              if (this.isNomDetailAvailable && element.formUrl == "next-of-kin") {

              } else if (!this.isNomDetailAvailable && element.formUrl == "nominee") {

              } else {
                this.toaster.error("Please Submit " + element.formNm + " first.", "Error");
                keepGoing = false;
                return;
              }


            }
          }
        }
      });
    }
    if (!keepGoing)
      return;
    this.spinner.show();
    this.addCommentsToModel();
    console.log(this.model.comment);
    this.spinner.hide();
    this.loanService.submitApp(this.model).subscribe((res) => {
      this.spinner.hide();
      if (res.status == 0) {
        this.toaster.success("Application Submitted");
        this.router.navigate(['loan-origination/landing']);
      } else if (res.status == 1) {
        this.toaster.error(res.message, "Rule Failed");
      } else if (res.status == 2) {
        this.toaster.error(res.message, "Error");
      } else if (res.status == 3) {
        this.toaster.error('NACTA Matched. Client and other individual/s (Nominee/CO borrower/Next of Kin) cannot be disbursed.', 'Warning');
        this.router.navigate(['loan-origination/landing']);
      } else if (res.status == 5) {
        this.toaster.error('NACTA Matched. Client and other individual/s (Nominee/CO borrower/Next of Kin) cannot be disbursed.', 'Warning');
      }
    }, (error) => {
      this.spinner.hide();
      this.toaster.error(error.error.text, "Error");
      console.log('err', error);
    });
  }

  openRejectModal() {
    (<any>$('#RejectLoanApplication')).modal('show');
  }
  amlNameMtch = "";
  approveApplication() {
    this.amlNameMtch = "";
    this.model.loanAppSeq = this.loanAppSeq;
    console.log(this.clientNomineeData);
    // if (this.clientNomineeData.relationKey == 545 && ) {

    // }

    if (this.model.loanProd == 49 || this.model.loanProd == 50) {
      this.spinner.show();
      this.vehicleLoansService.getVehicleInfoByLoan(this.loanAppSeq).subscribe((respose) => {
        this.spinner.hide();
        if (respose['failed']) {
          this.toaster.info("In-Valid Value of Vehicle Purchase Amount", "Information");
          this.router.navigate(['loan-origination/app/insurance-info']);
          return;
        }

        this.approveApplicationData();
      }, (error) => {
        this.spinner.hide();
        this.toaster.error(error.error.error, "Error");
        console.log('err', error);
        return;
      });
    }else{
      this.approveApplicationData();
    }
  }

  approveApplicationData(){

    for (let a = 0; a < this.clientInsuranceData.length; a++) {
      if (this.clientInsuranceData[a].relKey == 434 && this.clientNomineeData.relationKey == 545 && this.model.loanProd == 4) {
        // console.log(this.clientInsuranceData[a].relKey)
        // console.log(this.clientNomineeData.relationKey)
        // console.log('i am in approve')
        this.toaster.info('Duplicate Husbands cannot be added, Please remove one record', "Information");
        return;
      }
    }

    // Added by Areeba - 9-12-2022 - Credit Utilization Amt should be less than Approved Amt
    let loanUtilExist = 0;
    this.model.forms.forEach(
      (element, index) => {
        if (element.formUrl === 'expected-loan-utilication' ) {
          loanUtilExist = loanUtilExist + 1;
        }});
          
    if(loanUtilExist == 1 && this.model.loanUtilization && this.totalExpense !== this.model.approvedAmount){
      this.toaster.warning('Credit Utilization Amount must be equal to the Approved Loan Amount', "Information");
      return;
    }
    // Ended by Areeba

    //Added by Areeba - Vehicle Loan
    if (this.product.prdGrpSeq == 22 && this.model.yearsOfResidence == 0) {
      this.toaster.info('Client must be living in the Residence for atleast 1 year', "Information");
      return;
    }
    //Ended by Areeba

    // this.clientInsuranceData.forEach(ele => {
    //   if (ele.relKey == 434 && this.clientNomineeData.relationKey == 545) {
    //     this.toaster.info('Duplicate Husbands cannot be added, Please remove one record', "Information");
    //     return;
    //   }
    // })
    // if((+this.model.approvedAmount%1000)>0){
    //   this.toaster.error("Approved amount should be multiple of 1000");
    //   return;
    // }
    // if (this.model.approvedAmount <= 0) {
    //   this.toaster.error("Please Enter Valid Amount.");
    //   return;
    // }
    // if(this.model.reqAmount<this.model.approvedAmount){
    //   this.toaster.error("Approved amount exceeds Requested Amount");
    //   return;
    // }

    // if(this.product.maxAmount<this.model.approvedAmount){
    //   this.toaster.error("Approved amount exceeds Product's Max Amount");
    //   return;
    // }

    // if(this.product.minAmount>this.model.approvedAmount){
    //   this.toaster.error("Approved amount less than Product's Min Amount");
    //   return;
    // }
    this.spinner.show();
    this.loanService.approveApp(this.model).subscribe((res) => {
      this.spinner.hide();

      // Modified by Zohaib Asim - Dated 08-10-2021 - MFCIB 30 Days / NACTA Validation
      if (res.status == 0) {
        this.toaster.success(res.message);
        this.router.navigate(['loan-origination/landing']);
      } else if (res.status == 1) {
        this.toaster.error(res.message, "Rule Failed");
      } else if (res.status == 2) {
        this.toaster.error(res.message, "Error");
      } else if (res.status == 3) {
        this.toaster.warning('NACTA Matched. Client and other individual/s (Nominee/CO borrower/Next of Kin) cannot be disbursed.', 'Warning');
        this.router.navigate(['loan-origination/landing']);
      } else if (res.status == 4) {
        this.amlNameMtch = res.message;
        (<any>$('#AMLNameDialog')).modal('show');
      } else if (res.status == 5) {
        this.toaster.warning('NACTA Matched. Client and other individual/s (Nominee/CO borrower/Next of Kin) cannot be disbursed.', 'Warning');
        this.router.navigate(['loan-origination/landing']);
      } else if (res.status == 6) {
        this.toaster.error(res.message, "MFCIB not done");
      } else if (res.status == 7) {
        // Added By Naveed - Dated - 24-11-2021
        // Operation - SCR System Control
        this.discardApp();
      }
      // Ended By Naveed - Dated - 24-11-2021

    }, (error) => {
      this.spinner.hide();
      this.toaster.error("Something Went Wrong", "Error");
      console.log('err', error);
    });
  }

  // Added By Naveed - Dated - 24-11-2021
  // Operation - SCR System Control
  discardApp() {
    swal({
      title: 'Discard it',
      text: 'Dear User, as per the 30-day loan application policy, this application has expired and will be discarded. Please generate new application for the client.',
      type: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    })
      .then((result) => {
        if (result.value) {
          this.spinner.show();
          let cmnt = 'Discarded As per the 30-day loan application policy';
          this.loanService.deleteApplication(this.model.loanAppSeq, cmnt).subscribe(res => {
            this.spinner.hide();
            swal(
              'Discarded!',
              'Application has been Discarded.',
              'success'
            );
            this.router.navigate(['loan-origination/landing']);
          }, error => {
            this.spinner.hide();
            console.log(error)
          })
        }
      });
  }
  // Ended By Naveed - Dated - 24-11-2021

  closeAMlDialog() {
    (<any>$('#AMLNameDialog')).modal('hide');
    this.router.navigate(['loan-origination/landing']);
  }

  sendBackApplication() {
    // this.model.loanAppSeq = this.loanAppSeq;
    if (this.comment == null) {
      this.toaster.error("Please provide some reasoning");
      return;
    }
    if (this.comment.length <= 0) {
      this.toaster.error("Please provide Comments");
      return;
    }
    this.spinner.show();
    this.addCommentsToModel();
    this.loanService.sendbackApp(this.model).subscribe((res) => {
      this.spinner.hide();
      this.toaster.success("Application Sent Back for Clarification");
      (<any>$('#SendBack')).modal('hide');
      this.router.navigate(['loan-origination/landing']);

    }, (error) => {
      this.spinner.hide();
      this.toaster.error("Something Went Wrong", "Error");
      console.log('err', error);
    });
  }
  calculateTotalCharge(chargers) {
    let amt = 0;
    chargers.forEach(ch => {
      amt = amt + ch.amt;
    })
    return amt;
  }
  rejectApplication() {
    // this.model.loanAppSeq = this.loanAppSeq;
    console.log(this.model.rejectionReasonCd);
    console.log(this.model)
    if (this.model.rejectionReasonCd == null || this.model.rejectionReasonCd == 0) {
      this.toaster.error("Please select a Reason");
      return;
    }
    this.spinner.show();
    this.loanService.rejectApplication(this.model).subscribe((res) => {
      this.spinner.hide();
      this.toaster.success("Application Rejected");
      (<any>$('#RejectLoanApplication')).modal('hide');
      this.router.navigate(['loan-origination/landing']);

    }, (error) => {
      this.spinner.hide();
      this.toaster.error("Something Went Wrong", "Error");
      console.log('err', error);
    });
  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  cancelApplication() {
    this.deleteLoan(this.model.loanAppSeq);
  }

  loanAppIdToBeDeleted: any;
  deleteLoan(loanAppId: any) {
    this.loanAppIdToBeDeleted = loanAppId;
    (<any>$('#deleteConfirmation')).modal('show');
  }
  confirmDelete() {
    this.spinner.show();
    (<any>$('#deleteConfirmation')).modal('hide');
    this.loanService.deleteLoan(this.loanAppIdToBeDeleted).subscribe(res => {
      this.spinner.hide();
      this.router.navigate(['loan-origination']);
    }, (error) => {
      this.spinner.hide();
      console.log(error);
    });
  }
  paymentSchedule = [];
  onPaymentScheduleClick() {
    this.spinner.show();
    this.loanService.getPaymentSchedule(this.model.loanAppSeq).subscribe((res) => {
      this.spinner.hide();
      this.paymentSchedule = res;
      (<any>$('#scheduleModal')).modal('show');
    }, (error) => {
      this.spinner.hide();
      this.toaster.error("Something Went Wrong", "Error");
      console.log('err', error);
    });
  }

  modelSrc; modalCaption;
  loadModal(docimg, caption) {
    document.getElementById('myModal').style.display = "block";
    this.modelSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + docimg)
    this.modalCaption = caption;
  }
  closeModal() {
    document.getElementById('myModal').style.display = "none";
  }
}


export class LocationInfo {
  portName = "";
  branchCode = "";
  branchName = "";
  areaName = "";
  regName = ""; constructor() { }
}
