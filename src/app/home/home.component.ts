import { Router, ActivatedRoute } from '@angular/router';
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
              , private paymentTypesService: PaymentTypesService
              , private router: Router
              , private route : ActivatedRoute) { }

  private account: Account;
  private accountId;  
  private isBrandNew = false;
  private allUserAccounts: Array<Account>;
  private accountIndex;
  subscription: Subscription;  
  accUrlSubscription: Subscription;
  timerSubscription: Subscription;
  devMode = false;
  loggedInUserId = "";  

  ngOnInit() {
    this.loggedInUserId = this.userService.getLoggedInUser().UserId;          
    //this.subscribeToData();   
    this.getAllUserAccounts();
    // this.accUrlSubscription = this.route.params.subscribe((p : any) => {
    //   let aId = p['AccountId'];      
    //   this.accountId = aId;            
    // });      
    this.navigateToAccount();          
  }
  ngOnChanges() {
    //this.loggedInUserId = this.userService.getLoggedInUser().UserId;          
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

  public getAllUserAccounts() {
    this.subscription = this.accountService.accountsUpdated.subscribe(ac => 
    {
      this.allUserAccounts = ac;
      // if (this.accountId == undefined) {
      this.account = this.allUserAccounts.filter(ac => ac.IsFavourite == true)[0];
      this.accountId = this.account.AccountId;      
    // } else {                      
        //this.account = this.allUserAccounts.filter(ac => ac.AccountId == this.accountId)[0];                
      //}
      this.accountIndex = this.allUserAccounts.indexOf(this.account);
      this.navigateToAccount();
    });
    this.accountService.getAllUserAccounts();    
  }

  skipByAccounts(byVal : number) {        
    this.accountIndex = this.accountIndex + byVal < 0 
                     || this.accountIndex + byVal >= this.allUserAccounts.length ? 
    this.accountIndex : 
    this.accountIndex + byVal;

    this.account = this.allUserAccounts[this.accountIndex];          
    this.accountId = this.account.AccountId;    

    this.navigateToAccount();
  }  

  nextAccount() {
     this.skipByAccounts(1);
  }

  previousAccount(){
    this.skipByAccounts(-1);
  }

  calcMonthlyPayments(){    
  }

  navigateToAccount() {    
    if (this.accountId != undefined) {      
    this.router.navigate(['/home',this.accountId]);
    }
  }

}
