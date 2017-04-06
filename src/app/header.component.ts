import { Router } from '@angular/router';
import { UserService } from './user/user.service';
import { AccountService } from './account/account.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bb-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor(private accountService: AccountService, private userService: UserService, private router: Router) { }

  ngOnInit() {    
  }

  onLogOut(){
    this.userService.logOut();
    this.router.navigate(['signin']);
  }

}
