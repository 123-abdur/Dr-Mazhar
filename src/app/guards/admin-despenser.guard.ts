import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDespenserGuard implements CanActivate {
  loginUserData: any = JSON.parse(localStorage.getItem('userdata'));
  constructor(private routes: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      
    if (this.loginUserData.role == 'Doctor' || this.loginUserData.role == 'Despenser' || this.loginUserData.role == 'Admin') {
      return true;
    }
    else {
      this.routes.navigate(['']);
      localStorage.removeItem("userdata");
      return false;
    }
  }
  
}
