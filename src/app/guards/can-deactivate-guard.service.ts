import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: (component,route,state,next) => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate,
           route: ActivatedRouteSnapshot,
           state: RouterStateSnapshot,next:RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
       return component.canDeactivate ? component.canDeactivate(component,route,state,next) : true;
  }
}


