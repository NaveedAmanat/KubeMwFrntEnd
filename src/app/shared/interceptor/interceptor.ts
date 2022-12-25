import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError, retry, tap, finalize, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class MWHttpInterceptor implements HttpInterceptor {

   constructor(private router: Router, private toaster: ToastrService, private spinner: NgxSpinnerService) { }
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


      return next.handle(req).pipe(
         tap(evt => {
             if (evt instanceof HttpResponse) {
               return evt;
               //   if(evt.body && evt.body.success)
                     // this.toasterService.success(evt.body.success.message, evt.body.success.title, { positionClass: 'toast-bottom-center' });
             }
         }),
         catchError((err: any) => {
             if(err instanceof HttpErrorResponse) {
                console.log(err);
                if(err.status===401){
                   this.spinner.hide();
                  this.router.navigate(['/']);
                  this.toaster.error("Re Login to continue", "Session Destroyed");
                  return;
                }
                if(err.status == 0){
                  this.spinner.hide();
                  this.toaster.error("unable to reach server", "Server Unreachable");
                  return;
                }
                if (err.status === 409 || err.status === 400) {
                  this.spinner.hide();
                  this.toaster.warning(err.error.error, "Error");
                  return;
                }
                if(err.status == 500){
                  this.spinner.hide();
                  this.toaster.error("Something Went Wrong", "Internal Server Error");
                  return;
                }
               //  if (err.status === 400) {
               //    this.spinner.hide();
               //    this.toaster.warning(err.error.error, "Error");
               //    return;
               //  }
               //  if(err.status ===409){
               //    this.spinner.hide();
               //    this.toaster.warning(err.error, "Error");
               //  }
               //   try {
               //       // this.toasterService.error(err.error.message, err.error.title, { positionClass: 'toast-bottom-center' });
               //   } catch(e) {
               //       // this.toasterService.error('An error occurred', '', { positionClass: 'toast-bottom-center' });
               //   }
                 //log error 
             }
             return next.handle(err);
         }));
 
   }

   //    console.log(`${req.url} has been intercepted!`);
   //    console.log(req);
   //    console.log(next);
   //    return next.handle(req)
   //    .pipe(tap(event => {
   //       console.log(event);
   //       console.log(req);
   //       console.log(next)
   //       return event;
   //   }), catchError(err => {
   //    console.log(err)
   //       if (err.status === 401) {
   //          console.log("401")
   //       }
 
   //       const error = err.error.message || err.statusText;
   //       return throwError(error);
   //   }),
   //       finalize(() => {
   //       })
   //   );
      // return next.handle(req).pipe(
      //    catchError(error => {

      //       if (error instanceof HttpErrorResponse) {
      //          console.log(error)
      //          switch ((<HttpErrorResponse>error).status) {
      //             case 401:
      //                console.log("4011")
      //                // this.router.navigate(['/']);
      //                return Observable.throw(error);
      //             default:
      //                console.log("defalult");
      //                console.log(error)
      //                return Observable.throw(error);
      //          }
      //       } else {
      //          console.log(error)
      //          return Observable.throw(error);
      //       }
      //    })
      // );
   // };
}