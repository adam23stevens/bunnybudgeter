import { PaymentTypesService } from './../account/payment-types/payment-types.service';
import { UserService } from './../user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { Account } from './../account/Account';
import { AccountService } from './../account/account.service';
import { Component, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private accountService: AccountService
              , private userService: UserService
              , private paymentTypesService: PaymentTypesService) { }

  private account: Account;
  private accountId;
  private isBrandNew = false;
  private allUserAccounts: Array<Account>;
  private accountIndex;
  subscription: Subscription;  
  timerSubscription: Subscription;
  devMode = false;
  loggedInUserId = "";  

  ngOnInit() {
    this.loggedInUserId = this.userService.getLoggedInUser().UserId;          
    //this.subscribeToData();           
    this.getAllUserAccounts();
  }
  ngOnChanges() {
    this.loggedInUserId = this.userService.getLoggedInUser().UserId;          
    //this.subscribeToData();           
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onMockAccounts() {
    this.accountService.AddMockMonthlyPayments().subscribe(a => alert('mock accounts done'));     
  }
  onMockMonthlyPayments() {
    this.accountService.AddMockMonthlyPayments().subscribe(a => alert('mock monthly payments done'));
  }
  onMockPaymentTypes() {
    this.paymentTypesService.AddMockPaymentTypes().subscribe(a => alert('mock payment types got'));
  }

  // private subscribeToData(){
  //   this.timerSubscription = Observable.timer(2000).first().subscribe(() => this.getAllUserAccounts());
  // }

  public getAllUserAccounts() {            
        this.subscription = this.accountService.baseFetchAccounts().subscribe((acc : Account[]) => {                      
        this.allUserAccounts = acc.filter
        (a => a.ActiveUsers.findIndex(i => i.UserId == this.loggedInUserId) > -1);            

        this.account = this.allUserAccounts.filter(x => x.IsFavourite == true)[0];
        //bug to fix above in case no favourites are found        

        this.accountId = this.account.AccountId;    
        this.accountIndex = this.allUserAccounts.indexOf(this.account);                
        //this.subscribeToData();
    });        
  }

  skipByAccounts(byVal : number) {    
    this.accountIndex = this.accountIndex + byVal < 0 
                     || this.accountIndex + byVal >= this.allUserAccounts.length ? 
    this.accountIndex : 
    this.accountIndex + byVal;

    this.account = this.allUserAccounts[this.accountIndex];          
    this.accountId = this.account.AccountId;      
  }  

  nextAccount() {
     this.skipByAccounts(1);
  }

  previousAccount(){
    this.skipByAccounts(-1);
  }

  calcMonthlyPayments(){
    
  }

}
