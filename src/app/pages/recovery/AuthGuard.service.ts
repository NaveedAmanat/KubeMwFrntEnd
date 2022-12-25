import { Injectable } from "@angular/core";
import { CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot } from '@angular/router';
import { Auth } from "../../shared/models/Auth.model";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private toaster: ToastrService) {}
  auth: Auth;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    console.log(this.auth)
    let b = false;
    this.auth.modules.forEach(screen=>{
      if(screen.modUrl.indexOf("recovery")>=0){
        b =  true;
      }
    })
    if(!b){
      this.toaster.error("Permission Denied");
    }
    // ('Please Login to Continue');?
    return true;
  }
}