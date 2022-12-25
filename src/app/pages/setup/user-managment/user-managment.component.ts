import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserManagementService } from 'src/app/shared/services/user-managementservice';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  userManagForm: FormGroup;

  constructor(private userService: UserManagementService, private toaster: ToastrService,
    private spinner: NgxSpinnerService, private fb: FormBuilder, ) { }
  roles;
  mods;
  ngOnInit() {
    this.userManagForm = this.fb.group({
      usrRolNm: ['', Validators.required],
      usrRolSeq: ['']
    })

    this.userService.getRoles().subscribe(p => {
      this.roles = p;
    }, (error) => {
    });

    this.userService.getMods().subscribe(d => {
      this.mods = d
      console.log(d)
    }, (error) => {
    });
  }
  auth;
  obj;
  selectedRole = "";
  role;
  userClick(role) {
    this.role = role;
    this.selectedRole = role.usrRolNm;
    console.log(role);
    this.spinner.show();
    this.userService.getAuth(role.usrRolSeq).subscribe(p => {
      this.spinner.hide();
      this.auth = p;
      this.obj = JSON.parse(JSON.stringify(this.mods));
      this.obj.forEach(ele => {
        ele.subMods.forEach(sub => {
          this.auth.forEach(e => {
            if (e.sbModSeq == sub.sbModSeq) {
              sub.checked = true;
            }
          });
        });
      });
      console.log(this.obj)
      console.log(p)
    }, (error) => {
      this.spinner.hide();
    });
  }
  selectedOptions = [];
  onAreaListControlChanged(list, tta) {
    this.selectedOptions = list.selectedOptions.selected.map(item => item.value);
    console.log(this.selectedOptions);
    console.log(list);
    console.log(tta);
    let v: AppAuthDto = new AppAuthDto();
    v.aftrClsng = true;
    v.sbModSeq = tta.sbModSeq;
    v.usrRolSeq = this.role.usrRolSeq;
    if (this.selectedOptions.includes(tta)) {
      console.log("checked");
      v.checked = true;

    } else {
      console.log("unchecked");
      v.checked = false;
    }
    this.spinner.show();
    this.userService.updateAppAuth(v).subscribe(p => {
      this.spinner.hide();
      this.toaster.success("Updated")
      console.log(p)
    }, (error) => {
      this.spinner.hide();
    });
  }

  onAddUser() {
    (<any>$('#userManagmentmodal')).modal('show');
    this.userManagForm.reset();
  }

  onSubmitUserManagmentForm() {
    console.log(this.userManagForm.value)
    this.roles.push(this.userManagForm.value);
    (<any>$('#userManagmentmodal')).modal('hide');
    this.userManagForm.reset();
  }
  onEditUser(r) {
    (<any>$('#userManagmentmodal')).modal('show');
    this.userManagForm = this.fb.group({
      usrRolNm: [r.usrRolNm],
      usrRolSeq: [r.usrRolSeq]
    })
  }
}
export class AppAuthDto {
  sbModSeq;
  usrRolSeq;
  answrStr;
  aftrClsng;
  checked;
  delPrmFlg = true;
  readPrmFlg = true;
  wrtPrmFlg = true;
}