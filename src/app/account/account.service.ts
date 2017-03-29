import { MonthlyPayment } from './monthly-payments/monthly-payment';
import { Subscription } from 'rxjs/Subscription';
import { UserPaymentTypes } from './UserPaymentTypes';
import { mockUserPaymentTypes } from './MockData/mockUserPaymentTypes';
import { Payment } from './Payment';
import { mockPayments } from './MockData/mockPayments';
import { mockAccounts } from './MockData/mockAccounts';
import { Account } from './Account';
import { UserService } from './../user/user.service';
import { User } from './../user/User';
import { mockMonthlyPayments } from './MockData/mockMonthlyPayment';
import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs/Rx";

//Write a soft deletion for an account object. NEVER HARD DELETE THEM!

@Injectable()
export class AccountService implements OnInit {    

  public currUser: User;
  private userAccounts: Array<Account>;
  private monthlyPayments = mockMonthlyPayments;  
  private allAccounts = new Array<Account>();  
  private updatedAccount: Account;  
  public accountsUpdated = new EventEmitter<Account[]>();

  constructor(private userService : UserService, private http: Http) { 
    this.currUser = this.userService.getLoggedInUser();        
  }  
  
  ngOnInit() {
    this.fetchAccounts();
  }

  public AddMockAccounts() {
    const body = mockAccounts;
    const headers = new Headers();
    headers.append('Content-Type','application.json');      

    return this.http.put('https://bunnybudgeter.firebaseio.com/accounts.json', body, {headers: headers})
    .map((data: Response) => data.json());    
  }

  public AddMockMonthlyPayments() {
    const body = mockMonthlyPayments;
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');

    return this.http.put('https://bunnybudgeter.firebaseio.com/monthlypayments.json', body, {headers: headers})
    .map((data: Response) => data.json());   
  }

  public AddNewAccount(newAccount: Account) {
    //validation?
    this.baseFetchAccounts().subscribe(a => 
    {
      this.allAccounts = a;
      this.allAccounts.push(newAccount);

      newAccount.AccountId = this.allAccounts.indexOf(newAccount).toString();
    
      const body = JSON.stringify(this.allAccounts);
      const headers = new Headers();
      headers.append('Content-Type','application.json');      

      this.http.put('https://bunnybudgeter.firebaseio.com/accounts.json', body, {headers: headers})
      .map((data: Response) => data.json())
      .subscribe(() => alert('New account added successfully'));
    });
  }

  public setAllUserAccounts(obj : Account[]) : Subscription {      
    return this.baseFetchAccounts().subscribe(acc => {
        obj = acc.filter(a => a.ActiveUsers.findIndex(i => i.UserId == this.currUser.UserId) > -1);
    });  
  }

  public getAccounts(){
    return this.allAccounts;
  }  

  public getAllUserAccounts(){
    this.http.get('https://bunnybudgeter.firebaseio.com/accounts.json')    
    .map((response: Response) =>  response.json())
    .subscribe((acc : Account[]) => {
      this.allAccounts = acc.filter(a => a.ActiveUsers.findIndex(i => i.UserId == this.userService.getLoggedInUser().UserId) > -1);
      this.accountsUpdated.emit(this.allAccounts);
    });
  }  

  public getAccountById(accountId: string) {        
    var account = this.allAccounts.filter(a => a.AccountId == accountId)[0];            
    return account;
  }  

  public baseFetchAccounts() :Observable<Account[]> {
    return this.http.get('https://bunnybudgeter.firebaseio.com/accounts.json')    
    .map((response: Response) =>  response.json());    
  }  

  public baseFetchMonthlyPayments() : Observable<MonthlyPayment[]> {
    return this.http.get('https://bunnybudgeter.firebaseio.com/monthlypayments.json')
    .map((response: Response) => response.json());
  }

  public fetchAccounts() {      
    this.http.get('https://bunnybudgeter.firebaseio.com/accounts.json')
    .map((response: Response) => this.allAccounts = response.json())
    .subscribe((data: Account[]) => {      
      this.allAccounts = data;                  
    });                   
  }

  // public getFavouriteAccount() {        
  //   return this.getAllUserAccounts().filter(a => a.IsFavourite == true)[0];
  // }

  public getAllMonthlyPaymentsFromAccount(accountId: string) {
    return this.monthlyPayments.filter(p => p.AccountId == accountId);
  }

  public AddNewMonthlyPayment(newMonthlyPayment: MonthlyPayment) {    
    this.baseFetchMonthlyPayments().subscribe(mp => {        
      this.monthlyPayments = mp;
      this.monthlyPayments.push(newMonthlyPayment);

      newMonthlyPayment.MonthlyPaymentId = this.monthlyPayments.indexOf(newMonthlyPayment).toString();      
    
      const body = JSON.stringify(this.monthlyPayments);
      const headers = new Headers();
      headers.append('Content-Type','application.json');      

      this.http.put('https://bunnybudgeter.firebaseio.com/monthlypayments.json', body, {headers: headers})
      .map((data: Response) => data.json())
      .subscribe(() => alert('New monthly payment added successfully'));      
    });            
  }

  public EditMonthlyPayment(newMonthlyPayment: MonthlyPayment, existingMonthlyPaymentId: string) {    
    this.baseFetchMonthlyPayments().subscribe(p => 
    {
      this.monthlyPayments = p;  
      this.monthlyPayments[this.monthlyPayments.indexOf(this.monthlyPayments.filter(m => m.MonthlyPaymentId == existingMonthlyPaymentId)[0])] = newMonthlyPayment;      

      // this.allAccounts[this.allAccounts.indexOf(existingAccount)] = newAccount;

      const body = JSON.stringify(this.monthlyPayments);
      const headers = new Headers();
      headers.append('Content-Type', 'application.json');

      this.http.put('https://bunnybudgeter.firebaseio.com/monthlypayments.json', body, {headers: headers})
      .map((data: Response) => data.json())
      .subscribe(() => alert('done'));          
    });
  }

  public getMonthlyPaymentFromId(monthlyPaymentId: string) {
    return mockMonthlyPayments.filter(mp => mp.MonthlyPaymentId == monthlyPaymentId)[0];
  }
  public getPaymentFromMonthlyPaymentRec(monthlyPaymentId: string){
    return mockMonthlyPayments.filter(mp => mp.MonthlyPaymentId == monthlyPaymentId)[0].Payments;
  }
  deleteMonthlyPayment(monthlyPayment: MonthlyPayment) {

    monthlyPayment.IsDeleted = true;
    this.EditMonthlyPayment(monthlyPayment, monthlyPayment.MonthlyPaymentId);

    // var mpayment = this.getMonthlyPaymentFromId(monthlyPaymentId);
    // mockMonthlyPayments.splice(mockMonthlyPayments.indexOf(mpayment), 1);
  }  

  public addNewPayment(newPayment: Payment, accountId: string, userTypeName: string){
    this.updatedAccount = this.getAccountById(accountId);
    if (this.updatedAccount.Outgoings == null) {
      this.updatedAccount.Outgoings = new Array<Payment>();
    }
    if (this.updatedAccount.Income == null) {
      this.updatedAccount.Income = new Array<Payment>();
    }
    
    if (newPayment.Amount > 0) {
      this.updatedAccount.Outgoings.push(newPayment);
    } 
    if (newPayment.Amount < 0) {
      this.updatedAccount.Income.push(newPayment);
    }

    return this.EditAccount2(this.updatedAccount, accountId);
  }   

  
  public EditAccount2(newAccount: Account, accountId: string) {
    var allAccounts = this.getAccounts();

    this.allAccounts[this.allAccounts.indexOf(this.allAccounts.filter(a => a.AccountId === accountId)[0])] = newAccount;

    const body = JSON.stringify(this.allAccounts);
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');

    return this.http.put('https://bunnybudgeter.firebaseio.com/accounts.json', body, {headers: headers})
      .map((data: Response) => data.json())      
  }


  public EditAccount(newAccount: Account, accountId: string) {
    var allAccounts = this.getAccounts();

    this.allAccounts[this.allAccounts.indexOf(this.allAccounts.filter(a => a.AccountId === accountId)[0])] = newAccount;

    const body = JSON.stringify(this.allAccounts);
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');

    this.http.put('https://bunnybudgeter.firebaseio.com/accounts.json', body, {headers: headers})
      .map((data: Response) => data.json())
      .subscribe(() => alert('Account edited successfully'));    
  }

  fetchPayments(){
    return this.http.get('https://bunnybudgeter.firebaseio.com/payments.json')
    .map(response => response.json());
  }  

}
