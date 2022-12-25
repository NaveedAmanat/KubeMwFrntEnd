
import { 
    RouterStateSnapshot } from '@angular/router';
export class AuthService {
    constructor() {
      }  
   routes:any[]=[];   
   isValid(state: RouterStateSnapshot){
        return true;    
   }


}    