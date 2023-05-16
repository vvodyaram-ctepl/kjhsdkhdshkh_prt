// // import { Injectable } from '@angular/core';
// // import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// // import { Observable } from 'rxjs';

// // @Injectable()
// // class CanActivateTeam implements CanActivate {
// //   constructor(private permissions: Permissions) {}

// //   canActivate(
// //     route: ActivatedRouteSnapshot,
// //     state: RouterStateSnapshot
// //   ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
// //     // return this.permissions.canActivate(this.currentUser, route.params.id);
// //   }
// // }

// import { Injectable } from '@angular/core';
// import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
 
 
// @Injectable()
// export class AuthGuardService implements CanActivate {
//   canActivateFlag: boolean = false;
 
//     constructor(private _router:Router ) {
//     }
 
//     canActivate(route: ActivatedRouteSnapshot,
//                 state: RouterStateSnapshot): boolean {
 
//         //check some condition  
//         if (this.canActivateFlag)  {
//             alert('You are not allowed to view this page');
//             //redirect to login/home page etc
//             //return false to cancel the navigation
//             return true;
//         } 
//         return false;
//     }
 
// }
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}