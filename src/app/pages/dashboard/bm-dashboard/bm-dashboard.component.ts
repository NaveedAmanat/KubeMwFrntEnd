import { Component, OnInit } from '@angular/core';
import { Task } from '../../../shared/models/task.model';
import { TASKS } from '../../../shared/models/tasks.mocks';
import { STATUSCOLORS } from '../../../shared/models/statusColors.mocks';
import { RecoveryClosingService } from 'src/app/shared/services/recovery-closing.service';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bm-dashboard',
  templateUrl: './bm-dashboard.component.html',
  styleUrls: ['./bm-dashboard.component.css']
})
export class BmDashboardComponent implements OnInit {
  tasks: Task[] = TASKS;
  statusColors = STATUSCOLORS;
  public now: Date = new Date();
  constructor(private recoveryClosingService: RecoveryClosingService,
    private toaster: ToastrService,
      private router: Router,
      private spinner: NgxSpinnerService) {
    setInterval(() => {
      this.now = new Date();
    }, 1);
  }

  auth = JSON.parse(sessionStorage.getItem("auth"));
  ngOnInit() {
    let openDate = new Date(this.auth.brnchOpnDt);
    let now = new Date();
    if (openDate.getDate() != now.getDate()) {
      sessionStorage.setItem("closing", "true");
      this.auth.modules = [{deleteFlag: true,
        modNm: "Admin",
        readFlag: true,
        modUrl: "admin",
        writeFlag: true}];
        sessionStorage.setItem("auth", JSON.stringify(this.auth));
      // this.spinner.show();
      swal({
        title: 'Branch Closing',
        text: 'Branch not closed for '+ openDate.toDateString(),
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Redirect',
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {
          this.spinner.show();
          this.router.navigate(['admin/closing']);
        }
      });
    }




    //   this.recoveryClosingService.getRecoveryClosing().subscribe(data => {
    //     if (data.length > 0) {
    //       this.spinner.hide();
    //       // this.toaster.warning("Unposted Recoveries are Pending for " + openDate.toDateString(), "Warning", {
    //       //   disableTimeOut: true,
    //       //   closeButton: true,
    //       // });
    //       swal({
    //         title: 'Branch Closing',
    //         text: 'Un-Posted Recoveries are Pending for '+ openDate.toDateString(),
    //         type: 'warning',
    //         showCancelButton: false,
    //         confirmButtonColor: '#3085d6',
    //         confirmButtonText: 'Redirect',
    //         backdrop:false
    //       }).then((result) => {
    //         if (result.value) {
    //           this.spinner.show();
    //           this.router.navigate(['admin/closing']);
    //         }
    //       });
    //       return;
    //     }
    //     this.recoveryClosingService.getDisbursementClosing().subscribe(data => {
    //       this.spinner.hide();
    //       if (data.length > 0) {
    //         swal({
    //           title: 'Branch Closing',
    //           text: 'Un-Posted Disbursement are Pending for '+ openDate.toDateString(),
    //           type: 'warning',
    //           showCancelButton: false,
    //           confirmButtonColor: '#3085d6',
    //           confirmButtonText: 'Redirect',
    //           backdrop:false
    //         }).then((result) => {
    //           if (result.value) {
    //             this.spinner.show();
    //             this.router.navigate(['admin/closing']);
    //           }
    //         });
    //         return;
    //       }
    //       this.recoveryClosingService.getExpenseClosing().subscribe(data => {
    //         this.spinner.hide();
    //         if (data.length > 0) {
    //           swal({
    //             title: 'Branch Closing',
    //             text: 'Un-Posted Expense are Pending for '+ openDate.toDateString(),
    //             type: 'warning',
    //             showCancelButton: false,
    //             confirmButtonColor: '#3085d6',
    //             confirmButtonText: 'Redirect',
    //             backdrop:false
    //           }).then((result) => {
    //             if (result.value) {
    //               this.spinner.show();
    //               this.router.navigate(['admin/closing']);
    //             }
    //           });
    //           return;
    //         }
    //       });
    //     });


    //   });
    // }
    // }

  }

}
