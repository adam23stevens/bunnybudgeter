import { UserService } from './../user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { AccountItemComponent } from './account-item/account-item.component';
import { Account } from './Account';
import { AccountService } from './account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Payment } from "app/account/Payment";

@Component({
  selector: 'bb-account-listing',
  templateUrl: './account-listing.component.html',
  styles: []
})
export class AccountListingComponent implements OnInit {

  constructor(private accountService: AccountService
             ,private userService: UserService
             ,private router: Router) { }

  accounts: Array<Account>;  
  subscription: Subscription;

  ngOnInit() {
    this.subscription = this.accountService.baseFetchAccounts()
    .subscribe(acc => 
    {
      this.accounts = acc.filter(a => a.ActiveUsers.findIndex(i => i.UserId == this.userService.getLoggedInUser().UserId) > -1);                   
    });
  }

  viewAcc(accountId) {
   //this.router.navigate('') 
  }

}
