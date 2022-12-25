import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Auth } from "../../shared/models/Auth.model";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private toaster: ToastrService) { }
  auth: Auth;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.auth = JSON.parse(sessionStorage.getItem("auth"));
    for (let i = 0; i < this.auth.modules.length; i++) {
      if (this.auth.modules[i].modUrl == "admin")
        return true;
    }
    this.toaster.error("Permission Denied");
    // ('Please Login to Continue');?
    return false;
  }
}