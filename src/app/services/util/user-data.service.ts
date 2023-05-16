import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private user!: any;
  private userDataOservable = new BehaviorSubject<any>(this.user);
  public userData = this.userDataOservable.asObservable();
  constructor() { }

  public setUserData(userData: any): void {
    this.userDataOservable.next(userData);
  }
  public setRoleDetails(rolePermissions): void {
    console.log("rolePermissions", rolePermissions);
    localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
  }
  public getRoleDetails() {
    let rolePer = JSON.parse(localStorage.getItem('rolePermissions'));
    return {
      rolePermissions: rolePer
    };
  }
  public setUserDetails(userName, roleName, email, fullName): void {
    localStorage.setItem('userName', userName);
    localStorage.setItem('roleName', roleName);
    localStorage.setItem('email', email);
    localStorage.setItem('fullName', fullName);
  }
  public getUserDetails() {
    let usr = localStorage.getItem('userName');
    let role = localStorage.getItem('roleName');
    let email = localStorage.getItem('email');
    let fullName = localStorage.getItem('fullName');
    return {
      userName: usr,
      roleName: role,
      email: email,
      fullName
    };
  }

  public setToken(token, refresh_token, userId): void {
    localStorage.setItem(btoa(environment.tokenString), token);
    localStorage.setItem(btoa(environment.userId), userId);
    localStorage.setItem(btoa(environment.refreshTokenString), refresh_token);
  }
  public getToken() {
    return localStorage.getItem(btoa(environment.tokenString));
  }
  public getUserId() {
    return localStorage.getItem(btoa(environment.userId));
  }
  public getRefreshToken() {
    return localStorage.getItem(btoa(environment.refreshTokenString));
  }
  public unsetUserData(): void {
    /*localStorage.removeItem('userName');
    localStorage.removeItem('roleName');
    localStorage.removeItem('email');
    localStorage.removeItem('rolePermissions');
    localStorage.removeItem(btoa(environment.tokenString));
    localStorage.removeItem(btoa(environment.refreshTokenString));
    */
    this.userDataOservable.next(undefined);
    localStorage.clear();
  }
}
