import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../../../../shared/services/loan.service';
import { BreadcrumbProvider } from '../../../../shared/providers/breadcrumb';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import * as imageConversion from 'image-conversion';
import { setupRouter } from '@angular/router/src/router_module';
import { sanitizeUrl } from '@angular/core/src/sanitization/sanitization';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  readonly: Boolean = (sessionStorage.getItem('readonly') == 'true') ? true : false;

  constructor(private router: Router
    , private loanService: LoanService
    , private breadcrumbProvider: BreadcrumbProvider,
    public sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService) { }
  model: any;
  ngOnInit() {
    let basicCrumbs: any[] = [];
    basicCrumbs = JSON.parse(sessionStorage.getItem("basicCrumbs"));
    basicCrumbs.forEach(element => {
      this.breadcrumbProvider.addCheckedItem(element.formNm, "/loan-origination/app/" + element.formUrl, element.isSaved);
    });
    this.model = JSON.parse(sessionStorage.getItem('model'));


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

    console.log(this.model);
    this.displayAllImages();

    // Added by Areeba - Dated - 10-05-22 - Home Loan
    this.model.forms.forEach(element => {
      console.log(element.formUrl);
      if (element.formUrl == 'hil-appraisal') {
        this.isHomeLoan = true;
      }
    });
    // Ended by Areeba
  }

  displayAllImages() {
    this.spinner.show();
    this.loanService.getAllDocumentsForLoanApp(this.model.loanAppSeq).subscribe(res => {
      console.log("Loan Docs:", res)
      if (res != null) {
        this.spinner.hide();
        this.docs = [];
        res.forEach(d => {
          if (d.docImg != null && d.docSeq != 0 && d.docSeq != -1 && d.docSeq != -2) {
            this.docs.push(d);
          }
        })
      }
      // this.docs = res;
    })
  }
  modelSrc; modalCaption;
  loadModal(doc) {
    document.getElementById('myModal').style.display = "block";
    this.modelSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + doc.docImg)
    this.modalCaption = doc.crtdBy;
  }
  closeModal() {
    document.getElementById('myModal').style.display = "none";
  }
  docs;
  dataURItoBlob(dataURI) {
    const byteString = dataURI;
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    return blob;
  }
  continueClicked() {
    // this.router.navigate(['loan-origination/submit']);
    if (this.model.forms) {
      let i = 0;
      this.model.forms.forEach(
        forms => {
          if ("/loan-origination/app/" + forms.formUrl == this.router.url) {
            this.router.navigate(["/loan-origination/app/" + this.model.forms[i + 1].formUrl]);
          }
          i++;
        }
      );
    }
  }
  saveClicked() {
  }

  // Added by Areeba - Dated - 10-05-22 - Home Loan

  isHomeLoan: boolean = false;
  uploadedImage: File;
  url: any;
  msg = "";
  uploaded: boolean = false;
  uploadable: boolean = false;

  public onImageUpload(event) {


    this.uploaded = false;
    this.uploadedImage = event.target.files[0];
    console.log(this.uploadedImage);

    if (!this.uploadedImage || this.uploadedImage.size == 0) {
      this.msg = 'Please select an image';
      this.uploadable = false;
      return;
    }

    var mimeType = this.uploadedImage.type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      this.uploadable = false;
      return;
    }

    if (this.uploadedImage && this.uploadedImage.size > 358400) {

      //this.msg = 'Image size should be less than 500KB';
      //this.uploadable = false;
      imageConversion.compressAccurately(this.uploadedImage, 350).then((res) => {
        //console.log(res);
        var reader = new FileReader();
        reader.readAsDataURL(res);

        reader.onload = (_event) => {
          this.msg = "";
          this.uploadable = true;
          this.url = reader.result;
          this.url = this.url.split(',')[1];
          console.log(this.url);
        }
      });
    }

    else {
      var reader = new FileReader();
      reader.readAsDataURL(this.uploadedImage);

      reader.onload = (_event) => {
        this.msg = "";
        this.uploadable = true;
        this.url = reader.result;
        this.url = this.url.split(',')[1];
        console.log(this.url);
      }
    }
  }

  imageUploadAction() {

    this.spinner.show();
    this.loanService.addDocumentToLoanApp(this.url, this.model.loanAppSeq)
      .subscribe((res) => {

        if (res.AddNewLoanAppDoc == -1) {
          console.log("Image not uploaded due to some error!");
          this.uploaded = false;
        }
        else {
          console.log("success");
          this.uploaded = true;
          this.spinner.hide();
          this.displayAllImages();
          this.uploaded = true;
        }
      }
      );
  }
  // Ended by Areeba

}


