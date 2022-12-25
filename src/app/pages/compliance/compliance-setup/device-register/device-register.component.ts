import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplianceService } from 'src/app/shared/services/compliance.service';

@Component({
  selector: 'app-device-register',
  templateUrl: './device-register.component.html',
  styleUrls: ['./device-register.component.css']
})
export class DeviceRegisterComponent implements OnInit {
  AssignTabletForm: FormGroup;
  hasDvc: any = false;
  regUnReg: boolean = false;
  allEmployees: any[] = [];
  allRegisteredDevices: { result: any; };

  constructor(
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private complianceService: ComplianceService,
    private toaster: ToastrService) { }

  ngOnInit() {

    // All Registerd Devices
    this.getAllRegisterationDevices();

    //All Employees
    this.getAllEmployees();

    // Initializing Form
    this.AssignTabletForm = this.formBuilder.group({
      entyTypFlg: 3,
      dvcAddr: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(16)]],
      entyTypSeq: ['', Validators.required],
      crtdBy: ['', Validators.required],
    });

  };

  // Tablet button for modal
  openTabAssignment(device) {
    console.log(device);
    this.AssignTabletForm = this.formBuilder.group({
      entyTypFlg: 3,
      dvcAddr: [device.dvcAddr, [Validators.required, Validators.minLength(15), Validators.maxLength(16)]],
      entyTypSeq: [device.entyTypSeq, Validators.required],
      crtdBy: [device.crtdBy, Validators.required],
    });
    this.AssignTabletForm.controls['entyTypSeq'].disable();
    // unregister button
    this.regUnReg = true;
    (<any>$('#AssignTablet')).modal('show');
  };

  // Add button for modal
  openAddAssignment() {
    this.AssignTabletForm.reset();

    this.AssignTabletForm.controls['entyTypFlg'].setValue(3);
    // register button
    this.regUnReg = false;
    (<any>$('#AssignTablet')).modal('show');
  };

  // close modal
  closeModal() {
    (<any>$('#AssignTablet')).modal('hide');
  };

  // get controls of form
  get AssignTabletFormControls() {
    return this.AssignTabletForm.controls;
  };

  // get all emplyeees
  getAllEmployees() {
    this.complianceService.getEmployees().subscribe(res => {
      this.allEmployees = res;
      console.log(this.allEmployees);
    }, (error) => {
      if (error.status == 500) {
        this.spinner.hide();
        this.toaster.error("Internal Server Error", "Error");
      } else if (error) {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong", "Error")
      };
    });
  };

  // get employee name
  getEmployeeName(entyTypSeq) {
    let str = "";
    for (let i = 0; i < this.allEmployees.length; i++) {
      if (this.allEmployees[i].empSeq == entyTypSeq) {
        str = this.allEmployees[i].empNm
      }
      // this.allEmployees[i].empSeq == entyTypSeq ? str = this.allEmployees[i].empNm : str = '=';
    }
    return str;
  }

  // get all Registered Devices
  getAllRegisterationDevices() {
    this.spinner.show();
    this.complianceService.getRegistrationDevices().subscribe(data => {
      this.spinner.hide();
      this.allRegisteredDevices = data;
      console.log(this.allRegisteredDevices);
    }, (error) => {
      if (error.status == 500) {
        this.spinner.hide();
        this.toaster.error("Internal Server Error", "Error");
      } else if (error) {
        this.spinner.hide();
        this.toaster.error("Something Went Wrong", "Error");
      };
    });
  };

  //register Devices
  registerDevice() {
    if (!this.AssignTabletForm.valid) {
      this.AssignTabletForm.controls['dvcAddr'].markAsTouched();
      this.AssignTabletForm.controls['entyTypSeq'].markAsTouched();
      this.AssignTabletForm.controls['crtdBy'].markAsTouched();
      this.toaster.error("Please Fill Form Fields", "Error");
      return;
    } else {
      this.spinner.show();
      console.log(this.AssignTabletForm.getRawValue());
      let obj = this.AssignTabletForm.getRawValue();
      this.complianceService.registerComplianceDevice(obj).subscribe(res => {
        this.getAllRegisterationDevices();
        (<any>$('#AssignTablet')).modal('hide');
        this.spinner.hide();
        this.toaster.success("Device Registered Successfully", "Success")

        //unregister button
        this.regUnReg = true;
      }, (error) => {
        if (error.status == 500) {
          this.spinner.hide();
          this.toaster.error(error.error.title, "Error");
        } else if (error) {
          this.spinner.hide();
          this.toaster.error("Something Went Wrong", "Error")
        }
      });
    };
  };

  //unregister devices
  unregisterDevice() {
    if (!this.AssignTabletForm.valid) {
      this.AssignTabletForm.controls['dvcAddr'].markAsTouched();
      this.AssignTabletForm.controls['entyTypSeq'].markAsTouched();
      this.AssignTabletForm.controls['crtdBy'].markAsTouched();
      this.toaster.error("Please Fill Form Fields", "Error");
      return;
    } else {
      let obj = this.AssignTabletForm.getRawValue();
      console.log(obj);
      this.spinner.show();
      this.complianceService.unregisterComplianceDevice(obj).subscribe(data => {
        this.getAllRegisterationDevices();
        (<any>$('#AssignTablet')).modal('hide');
        this.spinner.hide();
        this.toaster.success("Device Unregistered Successfully", "Success");
      }, (error) => {
        if (error.status == 500) {
          this.spinner.hide();
          this.toaster.error("Internal Server Error", "Error");
        } else if (error) {
          this.spinner.hide();
          this.toaster.error("Something Went Wrong", "Error");
        }
      });
    }
  };

}
