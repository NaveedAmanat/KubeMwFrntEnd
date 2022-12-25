import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../../shared/models/User.model';
import { UserService } from '../../shared/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth } from '../../shared/models/Auth.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  footerYear: any;
  model = new User();
  constructor(private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService) { }

  ngOnInit() {
    let a = new Date();
    this.footerYear = a.getUTCFullYear();
    sessionStorage.clear();
    localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.clear();
  }
  onSubmit() {
    this.spinner.show();
    this.userService.loginUser(this.model).subscribe((auth: Auth) => {
      sessionStorage.clear();
      localStorage.clear();
      window.sessionStorage.clear();
      window.localStorage.clear();
      this.spinner.hide();
       /**
        * @Added: Naveed
        * @Description: Attendance (THIS CODE IS FOR GESA ATTENDANCE CHECK FOR EACH BDO AND BM)
        * @Date: 03-11-2022
        * */
      if(auth.manage){
        swal({
          title: 'Attendance',
          text: auth.manage['msg'] ? auth.manage['msg'] : '',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        })
        .then((result) => {
          if (result.value) {
            window.location.href = auth.manage['url'];
          }
        });
        return;
      }
      /**
       * @Ended: Naveed
       * */

      this.model.username = auth.loginId;
      auth.user = this.model;
      sessionStorage.setItem("token", auth.id_token);
      sessionStorage.setItem("auth", JSON.stringify(auth));
      sessionStorage.setItem("portfolioSeq", auth.emp_portfolio);
      sessionStorage.setItem("closing", "false");
      this.router.navigate([auth.modules[0].modUrl]);
      this.toaster.success('You have logged in Successfully.', 'Welcome')
      // this.userInfo = data;
    }, (error) => {
      this.spinner.hide();
      if (error.status == 0) {
        this.toaster.error("unable to reach server", "Server Unreachable");
      } else if (error.status == 400) {
        this.toaster.error("Invalid Credentials.", "Error");
      }

      // this.toaster.error(error.error.error, `Login failed:`);
      console.log("err In User Service");
      console.log("err", error);
    });
  }
}
