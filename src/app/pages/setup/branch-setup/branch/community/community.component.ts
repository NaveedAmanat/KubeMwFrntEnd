import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProvider } from 'src/app/shared/providers/breadcrumb';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataService } from 'src/app/shared/services/data.service';
import * as REF_CD_GRP_KEYS from 'src/app/shared/models/REF_CODE_GRP_KEYS.mocks';
import { Community } from 'src/app/shared/models/community.model';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  constructor(private breadcrumbProvider: BreadcrumbProvider,
    private commonService: CommonService,
    private router: Router,
    private toaster: ToastrService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }

  // Variables 
  basicCrumbs: any[] = [];
  formSaved = false;
  brmodel: any;

  communities: any;
  communityForm: FormGroup;
  ports: any;
  invalid: boolean = false;
  status: any;
  isEdit: boolean = false;

  ngOnInit() {
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'community' && element.isSaved == true) {
        this.formSaved = true;
      }
    });
    this.brmodel = JSON.parse(sessionStorage.getItem('brmodel'));

    if(this.brmodel.cmntySeq == -1){
      this.brmodel.cmntySeq = null;
    }

    this.commonService.getValues(REF_CD_GRP_KEYS.STATUS).subscribe((res) => {
      this.status = res;
    });

    this.communityForm = this.formBuilder.group({
      comSeq: [''],
      cmntyName: [''],
      cmntyDescription: [''],
      cmntyStatus: [''],
      portfolioSeq: ['']
    });

    this.showPortfolios();
    this.listing(1);
  }

  ngAfterInit() {
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'community' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
    this.showPortfolios();
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

  findPortNm(portSeq) {
    if (this.ports) {
      for (let i = 0; i < this.ports.length; i++) {
        if (this.ports[i].portSeq == portSeq) {
          return this.ports[i].portNm;
        }
      }
    }
  }

checkPortSeq(portSeq) {
    if (this.ports) {
      for (let i = 0; i < this.ports.length; i++) {
        if (this.ports[i].portSeq == portSeq) {
          return true;
        }
      }
      return false;
    }
  }

  // On Continue
  continueClicked() {
    this.formSaved = true;
    this.basicCrumbs = JSON.parse(sessionStorage.getItem('basicCrumbs'));
    this.basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
      if (element.formUrl == 'community' && this.formSaved == true) {
        element.isSaved = true;
      }
    });
    sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));
    this.router.navigate(['setup/branch/port-loc-info']);
  }
  prevScreen(){
    this.router.navigate(['setup/branch/portfolio']);
  }

  cmntySeq: number;
  portSeq: number;
  cmntyNm: string;
  cmntyStsKey: number;
  cmntyCmnt: string;

  // Add a New Community
  addCommunities() {
    this.isEdit = false;
    this.cmntySeq = null;
    this.portSeq = null;
    this.cmntyNm = null;
    this.cmntyStsKey = null;
    this.cmntyCmnt = null;
    (<any>$('#addCmntys')).modal('show');
  }

  editCommunity(cmnty) {
    this.isEdit = true;
    this.cmntySeq = cmnty.cmntySeq;
    this.portSeq = cmnty.portSeq;
    this.cmntyNm = cmnty.cmntyNm;
    this.cmntyStsKey = cmnty.cmntyStsKey;
    this.cmntyCmnt = cmnty.cmntyCmnt;
    (<any>$('#addCmntys')).modal('show');
  }

  onCmntyFormSubmit(cmnty) {
    // stop here if form is invalid
    if (cmnty.cmntyNm == "" || cmnty.cmntyStsKey == null || (cmnty.portSeq == null && this.portSeq == null)) {
      this.invalid = true;
    }
    else {
      this.invalid = false;
    }
    if (this.invalid) {
      this.toaster.info('Missing fields');
      return;
    }

    this.communityForm.reset();

    if (!this.isEdit) {
      this.communityForm = this.formBuilder.group({
        comSeq: [this.cmntySeq],
        cmntyName: [cmnty.cmntyNm.trim().toUpperCase()],
        cmntyDescription: [cmnty.cmntyCmnt ? cmnty.cmntyCmnt.trim().toUpperCase() : cmnty.cmntyCmnt],
        cmntyStatus: [cmnty.cmntyStsKey],
        portfolioSeq: [cmnty.portSeq]
      });
      this.spinner.show();
      this.dataService.addCommunity(this.communityForm.value).subscribe((data) => {
        this.spinner.hide();
        this.toaster.success('Community added to this portfolio');
        //this.brmodel.communities.push(data.cmnty);
        this.brmodel.communities.unshift(data.cmnty);
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.listing(1);
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    else {
      this.communityForm = this.formBuilder.group({
        comSeq: [this.cmntySeq],
        cmntyName: [cmnty.cmntyNm.trim().toUpperCase()],
        cmntyDescription: [cmnty.cmntyCmnt ? cmnty.cmntyCmnt.trim().toUpperCase() : cmnty.cmntyCmnt],
        cmntyStatus: [cmnty.cmntyStsKey],
        portfolioSeq: [this.portSeq]
      });
      this.spinner.show();
      this.dataService.updateCommunity(this.communityForm.value).subscribe((data) => {
        this.spinner.hide();
        this.toaster.success('Community updated');
        for (let i = 0; i < this.brmodel.communities.length; i++) {
          if (this.brmodel.communities[i].cmntySeq == data.cmnty.cmntySeq) {
            this.brmodel.communities[i].cmntyNm = data.cmnty.cmntyNm;
            this.brmodel.communities[i].cmntyCmnt = data.cmnty.cmntyCmnt;
            this.brmodel.communities[i].cmntyStsKey = data.cmnty.cmntyStsKey;
            break;
          }
        }
        sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
        this.listing(1);
      }, (error) => {
        this.spinner.hide();
        console.log('err', error);
        this.toaster.warning('err', error);

      });
    }
    (<any>$('#addCmntys')).modal('hide');
    cmnty = null;
  }

  deleteCommunity(cmnty) {
    swal({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this Community permanently?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
    this.spinner.show();
    this.dataService.delCommunity(cmnty.cmntySeq).subscribe((data) => {
      this.toaster.success('Community deleted');
      if(this.brmodel.cmntySeq == cmnty.cmntySeq){
        this.brmodel.cmntySeq = null;
        this.basicCrumbs.forEach(element => {
          if (element.formUrl == 'port-loc-info') {
            element.isSaved = false;
          }
          this.breadcrumbProvider.addCheckedItem(element.formNm, '/setup/branch/' + element.formUrl, element.isSaved);
          
        });
        sessionStorage.setItem("basicCrumbs", JSON.stringify(this.basicCrumbs));
      }
      for (let i = 0; i < this.brmodel.communities.length; i++) {
        if (this.brmodel.communities[i].cmntySeq == cmnty.cmntySeq) {
          this.brmodel.communities.splice(i, 1);
          break;
        }
      }
      this.spinner.hide();
      sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
      this.listing(1);
    }, (error) => {
      this.spinner.hide();
      console.log('err', error);
      this.toaster.warning('err', error);
    });
  });
  }

  showPortfolios() {
    this.spinner.show();
    this.dataService.getPortfolio(this.brmodel.brnchSeq).subscribe((data) => {
      this.spinner.hide();
      this.ports = data;
      // initialize to page 1
    }, (error) => {
      this.spinner.hide();
      this.toaster.warning('Ports not found.', error);
    });
  }

  uploadLists: Community[] = [];
  data: any;
  uploadCmntyList: Community = new Community();

  openFile(event) {
    this.toaster.info("Uploading Data.");
    event.click();
  }

  inputClear(event) {
    event.target.value = null;
  }
  handle(event) {
    if (!(event.target.value.endsWith(".xlsx") || event.target.value.endsWith(".xls"))) {
      this.toaster.info('Please Choose Specific Format of Excel File ', 'Information');
      return;
    }

    this.uploadLists = [];

    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      this.toaster.info("You Can't Select More then One File", 'Information');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let withoutHeaderLists = this.data.slice(1);

      let incorrectFile: boolean = false;
      for( let i = 0; i < withoutHeaderLists.length; i++){
        if (withoutHeaderLists[i].length > 3){
          incorrectFile = true;
        }
      }
      let counter = 0;
      withoutHeaderLists.forEach((r: any[]) => {
        this.uploadCmntyList = new Community();

        console.log(r.length);
        if (r.length > 0 && r.length < 4 && r !== undefined) {
          let dataRecognized = false;
          if (r[0] !== undefined && r[0] > 0 && r[1] !== undefined && !incorrectFile) {
            dataRecognized = true;
          }
          if (dataRecognized == true) {
            if(this.checkPortSeq(r[0]) == false){
              this.toaster.info("Portfolio Code " + r[0] +" does not exist on this branch.", "Incorrect Portfolio Code!");
            }
            else if(this.checkUploadData(r[1])){
              this.toaster.info("Please remove special characters from Name: " + r[1], "Incorrect Community Name!");
            }
            else if(r[2] !== undefined && this.checkUploadData(r[2])){
              this.toaster.info("Please remove special characters from Description: " + r[1], "Incorrect Community Description!");
            }
            else{
            try{
            this.uploadCmntyList.portfolioSeq = r[0];
            this.uploadCmntyList.cmntyName = r[1].trim().toUpperCase();
            this.uploadCmntyList.cmntyDescription = r[2] ? r[2].trim().toUpperCase() : r[2];

            //this.uploadLists.push(this.uploadCmntyList);
            this.uploadLists.unshift(this.uploadCmntyList);
            }
            catch(err){
              this.toaster.info("Please select correct file.", "Information!");
            }
          }
          } else {
            this.toaster.info("Please select correct file.", "Information!");
          }
          this.uploadCmntyList = null;
        }
        else{
          counter++;
        }
      });

      console.log('Uploading Data:', this.uploadLists);

      if (this.uploadLists.length > 0 && this.uploadLists.length + counter == withoutHeaderLists.length) {
        swal({
          title: 'Are you sure?',
          text: "Are you sure you want to upload File?",
          type: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Upload it!'
        }).then((result) => {
          if (result.value) {
            this.spinner.show();
            this.dataService.uploadCommunity(this.uploadLists).subscribe(result => {
              console.log("FileUploaded:", result);

              result.cmntys.forEach(c => {
                //this.brmodel.communities.push(c);
                this.brmodel.communities.unshift(c);
                sessionStorage.setItem("brmodel", JSON.stringify(this.brmodel));
              });
              this.listing(1);
              this.spinner.hide();
              swal(
                'Upload File!',
                result.success,
                'success'
              )
            }, error => {
              this.spinner.hide();
              this.toaster.error("err", error)
            });
          }
        })
      }
    };
    reader.readAsBinaryString(target.files[0]);
    reader.abort;
    this.spinner.hide();
  }
  pager: any = {};
  // paged items
  pagedItems: any = [];

  listing(page: number) {
    this.setPage(page);
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.dataService.getPager(this.brmodel.communities.length, page);

    // get current page of items
    this.pagedItems = this.brmodel.communities.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  keyPress(event: any) {
    const pattern = /[a-zA-Z0-9\+\-\/\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyPressText(event: any) {
    const pattern = /[a-zA-Z\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyNumbers(event: any) {
    const pattern = /[0-9-]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyDecimals(event: any) {
    const pattern = /[0-9\+\.]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  checkUploadData(string){
    const pattern = /[!@#$%^&*()_+=\[\]{};':"\\|,.<>?]/;
    return pattern.test(string);
  }

}
