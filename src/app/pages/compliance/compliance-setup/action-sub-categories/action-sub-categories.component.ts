import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-action-sub-categories',
  templateUrl: './action-sub-categories.component.html',
  styleUrls: ['./action-sub-categories.component.css']
})
export class ActionSubCategoriesComponent implements OnInit {
  actionSubCategoryForm: FormGroup;
  actionSubCategories: any;
  categories: any;

  constructor(private fb: FormBuilder,
    private complianceService: ComplianceService,
    private toaster: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.actionSubCategoryForm = this.fb.group({
      subCtgryId: [],
      subCtgryNm: ['', Validators.required],
      sbCtgrySeq: [],
      subCtgryCmnt: [''],
      adtCtgrySeq: [this.route.snapshot.paramMap.get('adtCtgrySeq')],
    });

    this.complianceService.getCategories().subscribe(res => {
      this.categories = res;
      console.log(this.categories)
    });

    this.complianceService.getSubCategories(this.route.snapshot.paramMap.get('adtCtgrySeq')).subscribe(res => {
      this.actionSubCategories = res;
    });

  }

  onlyNumbers(event: any) {
    const pattern = /[0-9]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyLetters(event: any) {
    const pattern = /[a-zA-Z ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.charCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  openSubCategoryModel() {
    this.actionSubCategoryForm.reset();
    this.actionSubCategoryForm.controls['adtCtgrySeq'].setValue(this.route.snapshot.paramMap.get('adtCtgrySeq'));
    (<any>$('#addActionSubCategory')).modal('show');
  }

  onEditActionSubCategory(sub) {
    (<any>$('#addActionSubCategory')).modal('show');
    this.actionSubCategoryForm = this.fb.group({
      subCtgryId: [sub.subCtgryId],
      subCtgryNm: [sub.subCtgryNm],
      sbCtgrySeq: [sub.sbCtgrySeq],
      subCtgryCmnt: [sub.subCtgryCmnt],
      adtCtgrySeq: [sub.adtCtgrySeq]
    });
  }

  onDeleteActionSubCategory(sub) {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Action Sub Category?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.complianceService.deleteSubCategory(sub.sbCtgrySeq).subscribe(data => {
          this.actionSubCategories.splice(this.actionSubCategories.indexOf(sub), 1);
          swal(
            'Deleted!',
            'Action Sub Category Deleted Successfully.',
            'success'
          );
        });
      }
    });
  }

  onSubmitActionCategory() {
    this.complianceService.postingSubCategories(this.actionSubCategoryForm.value).subscribe(response => {
      this.toaster.success('Saved');
      this.complianceService.getSubCategories(this.route.snapshot.paramMap.get('adtCtgrySeq')).subscribe(res => {
        this.actionSubCategories = res;
        this.actionSubCategoryForm.reset();
      });
      (<any>$('#addActionSubCategory')).modal('hide');
    }, error => {
      this.toaster.error('Something Went Wrong')
    });
  }

}
