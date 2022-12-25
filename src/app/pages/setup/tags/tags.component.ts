import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../../shared/services/tags.service';
import { Tag } from '../../../shared/models/tag.model';
import { FormBuilder, FormGroup, Validators,NgForm  } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  
  public tags: Tag[];
  public addTag: Tag = new Tag();
  public isEdit: Boolean = false;

  tagForm: FormGroup;
  submitted = false;


  constructor(private formBuilder: FormBuilder,private tagsService: TagsService) {
   }

   ngOnInit() {
    
    this.tagForm = this.formBuilder.group({
      tagNm: ['', Validators.required],
      tagDscr: ['', Validators.required],
      svrtyFlgKey: ['', Validators.required],
      });
    this.tagsService.getTags().subscribe(data => this.tags = data);
  }

  get form() 
  { 
    return this.tagForm.controls; 
  }

  onAddNewClick() {
    this.tagForm.reset();
    this.isEdit = false;
    this.addTag = new Tag();
    (<any>$('#businessector')).modal('show');
  }
  
  addTagsSubmit(){
    this.submitted = true;
    if (this.tagForm.invalid) {
      return;
  }
    this.addTag.tagNm= this.tagForm.value.tagNm;
    this.addTag.tagDscr= this.tagForm.value.tagDscr;
    this.addTag.svrtyFlgKey= this.tagForm.value.svrtyFlgKey;

    (<any>$('#businessector')).modal('hide');
    console.log(this.addTag);
    if(this.isEdit) {
      this.tagsService.updateTag(this.addTag).subscribe(data => {
        this.addTag = data;
        this.tagsService.getTags().subscribe(data => this.tags = data);
      });
    }
    else {
      this.tagsService.addTag(this.addTag).subscribe(data => {
        this.addTag = data;
        this.tagsService.getTags().subscribe(data => this.tags = data);
      }); 
    }         
  }

  onEdit(Tags){
    this.isEdit = true;
    this.tagForm.patchValue(Tags);
    console.log(Tags);
    this.addTag = Tags;
    (<any>$('#businessector')).modal('show');
  }

  onDelete(Tags) { 

    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Tag?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.tagsService.deleteTag(Tags).subscribe(data => {
          this.tagsService.getTags().subscribe(data => this.tags = data);
        }); 
      }
    });

    console.log(Tags);  
  }
    getFlag(key)
  {
    let flag='';
    if(key===1)
    {
      flag='Yes';
    }
    else if(key===0)
    { 
      flag='No';
    }
    return flag; 
  }
}


