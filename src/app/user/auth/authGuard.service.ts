import { UserService } from './../user.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable()
export class authGuard implements CanActivate {

    constructor(private userService: UserService){}

    canActivate(route : ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.userService.isAuthenticated();
    }
}