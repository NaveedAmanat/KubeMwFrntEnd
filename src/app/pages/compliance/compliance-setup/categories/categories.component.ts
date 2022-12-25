import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import swal from 'sweetalert2';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categoryTypes = [
    { value: 1, viewValue: 'Client' },
    { value: 2, viewValue: 'Branch' }
  ]
  categoryForm: FormGroup;
  categories: any;

  slabsForm: FormGroup;
  entryButton: boolean = false;
  catSeq: any;
  allSlabs: any;
  slbs: FormArray;

  constructor(private fb: FormBuilder,
    private complianceService: ComplianceService,
    private toaster: ToastrService, ) { }

  ngOnInit() {
    // ctgryEntyFld
    this.categoryForm = this.fb.group({
      ctgryId: [],
      ctgryNm: ['', Validators.required],
      ctgryScr: ['', Validators.required],
      calcTyp: ['', Validators.required],
      ctgryTyp: ['', Validators.required],
      ctgryEntyFlg: ['', Validators.required],
      ctgryCmnt: [''],
      adtCtgrySeq: ['']
    });

    this.slabsForm = this.fb.group({
      slbs: this.fb.array([this.createForm()])
    });

    this.complianceService.getCategories().subscribe(res => {
      this.categories = res;
      console.log(this.categories);
    })

    this.entryButton = true;
    this.allSlabs = [];
  }

  // creating slabbing form
  createForm() {
    return this.fb.group({
      startLmt: ['', Validators.required],
      endLmt: ['', Validators.required],
      val: ['']
    })
  }

  //opening the slabbing model
  onClickAdd(cat) {
    this.slbs = this.slabsForm.get('slbs') as FormArray;
    console.log(this.slbs)
    this.slbs = this.fb.array([]);
    console.log(this.slbs)
    this.slbs.push(
      this.fb.group({
        startLmt: [0],
        endLmt: ['', Validators.required],
        val: ['', Validators.required]
      })
    );
    (<any>$('#slabing')).modal('show');
    console.log(this.slabsForm)
  }

  f() {
    return this.slabsForm.controls;
  }

  t() {
    return this.f().slbs as FormArray;
  }

  //adding new line in slabbing from
  onAddButton(): void {
    this.slbs = this.slabsForm.get('slbs') as FormArray;
    // this.slbs.controls.forEach(ele => {
    //   ele.value.startLmt.setValue(ele.value.startLmt + 1)
    // })
    this.slbs.push(this.createForm());
  }

  //deleteing last line in slabbing form
  onDeleteButton() {
    this.slbs.removeAt(this.slbs.length - 1);
  }

  //Submit Slabbing form
  onSubmitSlabs() {
    console.log(this.slabsForm.value);
  }

  // check for only numbers
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // check for only letters
  onlyLetters(event: any) {
    const pattern = /[a-zA-Z ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  openCategoryModel() {
    this.categoryForm.reset();
    this.categoryForm.clearValidators();
    (<any>$('#addCategory')).modal('show');
  }

  onEditCategories(cat) {
    (<any>$('#addCategory')).modal('show');
    this.categoryForm = this.fb.group({
      adtCtgrySeq: [cat.adtCtgrySeq],
      ctgryId: [cat.ctgryId],
      ctgryNm: [cat.ctgryNm, Validators.required],
      ctgryScr: [cat.ctgryScr, Validators.required],
      calcTyp: [cat.calcTyp],
      ctgryTyp: [cat.ctgryTyp, Validators.required],
      ctgryCmnt: [cat.ctgryCmnt],
      ctgryEntyFlg: [cat.ctgryEntyFlg]
    });
    console.log(this.categoryForm.value)
  }

  onDeleteCategories(cat) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Category?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.complianceService.deleteCategory(cat.adtCtgrySeq).subscribe(data => {
          console.log(this.categories)
          this.categories.splice(this.categories.indexOf(cat), 1);
          swal(
            'Deleted!',
            'Category Deleted Successfully.',
            'success'
          );
        });
      }
    });
  }

  onSubmitCategory() {
    this.complianceService.postingCategories(this.categoryForm.value).subscribe(response => {
      this.toaster.success('Saved');
      this.complianceService.getCategories().subscribe(res => {
        this.categories = res;
        this.categoryForm.reset();
      });
      (<any>$('#addCategory')).modal('hide');
    }, error => {
      this.toaster.error('Something Went Wrong')
    });
  }


  slbForCat = { slbs: [{ adtCtgrySeq: null, catSlbSeq: null, endLmt: null, startLmt: 0, val: null }] };
  openProductChargeSlbModal(cat) {
    this.allSlabs = [];
    this.complianceService.gettingSlabs(cat.adtCtgrySeq).subscribe(res => {
      this.allSlabs = res;
      // console.log(this.allSlabs.slbs.sort())
      if (this.allSlabs.length > 0) {
        this.slbForCat.slbs = [];
        for (let i = 0; i < this.allSlabs.length; i++) {
          this.slbForCat.slbs.push({ adtCtgrySeq: this.allSlabs[i].adtCtgrySeq, catSlbSeq: this.allSlabs[i].adtCtgrySlbsSeq, endLmt: this.allSlabs[i].endLmt, startLmt: this.allSlabs[i].startLmt, val: this.allSlabs[i].dedScr })
        }
        (<any>$('#value')).modal('show');
      } else {
        this.slbForCat = { slbs: [{ adtCtgrySeq: cat.adtCtgrySeq, catSlbSeq: null, endLmt: null, startLmt: 0, val: null }] }
        this.catSeq = cat.adtCtgrySeq
        if (this.slbForCat.slbs.length <= 0) {
          this.slbForCat.slbs.push({ adtCtgrySeq: this.catSeq, catSlbSeq: null, endLmt: null, startLmt: 0, val: null })
        }
        (<any>$('#value')).modal('show');

      }
    })
  }

  addLine() {
    // console.log(this.slbForCat.slbs)
    // console.log(this.slbForCat.slbs.length - 1)
    // console.log(this.slbForCat.slbs[1])
    // console.log(this.slbForCat.slbs[this.slbForCat.slbs.length - 1].endLmt)
    // console.log(this.slbForCat.slbs[this.slbForCat.slbs.length - 1].endLmt + 0.1)
    let a = this.slbForCat.slbs.length - 1;
    this.slbForCat.slbs.push({ adtCtgrySeq: this.catSeq, catSlbSeq: null, startLmt: (this.slbForCat.slbs.length <= 0) ? null : this.slbForCat.slbs[a].endLmt + 0.1, endLmt: null, val: null })
  }

  deleteLine(a) {
    console.log(a)
    this.slbForCat.slbs.splice(this.slbForCat.slbs.indexOf(a), 1);
  }

  onSlbSubmit() {
    console.log(this.slbForCat.slbs)
    console.log(this.catSeq)
    this.complianceService.slabsSubmission(this.slbForCat.slbs).subscribe(response => {
      console.log(response)
      this.toaster.success('Saved', "Success");
      this.complianceService.getCategories().subscribe(res => {
        this.categories = res;
        this.categoryForm.reset();
      });
      (<any>$('#value')).modal('hide');
    }, error => {
      this.toaster.error('Something Went Wrong')
    });
  }
}
