import { DataService } from './../data.service';
import { MonthlyPayment } from './monthly-payments/monthly-payment';
import { Subscription } from 'rxjs/Subscription';
import { UserPaymentTypes } from './UserPaymentTypes';
import { mockUserPaymentTypes } from './MockData/mockUserPaymentTypes';
import { Payment } from './Payment';
import { mockPayments } from './MockData/mockPayments';
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
  public paymentsUpdated = new EventEmitter<Payment[]>();
  public monthlyPaymentsUpdated = new EventEmitter<MonthlyPayment[]>();
  dataUrl = "";

  constructor(private userService : UserService, private dataService: DataService, private http: Http) { 
    this.currUser = this.userService.getLoggedInUser();        
  }  
  
  ngOnInit() {
    this.fetchAccounts();    
  }

  public AddMockAccounts() {
    // const token = this.userService.getTokener();
    // const body = mockAccounts;
    // const headers = new Headers();
    // headers.append('Content-Type','application.json');      

    // return this.http.put('https://bunnybudgeter.firebaseio.com/accounts.json?auth=' + token, body, {headers: headers})
    // .map((data: Response) => data.json());    
  }

  public AddMockMonthlyPayments() {
    const token = this.userService.getTokener();
    const body = mockMonthlyPayments;
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');    

    return this.http.put(this.dataService.getAccessUrl() + 'monthlypayments.json?auth=' + token, body, {headers: headers})
    .map((data: Response) => data.json());   
  }

  public AddNewAccount(newAccount: Account) {
    const token = this.userService.getTokener();
    //validation?
    this.baseFetchAccounts().subscribe(a => 
    {
      this.allAccounts = a;
      this.allAccounts.push(newAccount);

      newAccount.AccountId = this.allAccounts.indexOf(newAccount).toString();
    
      const body = JSON.stringify(this.allAccounts);
      const headers = new Headers();
      headers.append('Content-Type','application.json');      

      this.http.put(this.dataService.getAccessUrl() + 'accounts.json?auth=' + token, body, {headers: headers})
      .map((data: Response) => data.json())
      .subscribe(() => alert('New account added successfully'));
    });
  }

  public AddNewAccount2(newAccount: Account) {
    const token = this.userService.getTokener();
    this.allAccounts.push(newAccount);

    newAccount.AccountId = this.allAccounts.indexOf(newAccount).toString();
    
      const body = JSON.stringify(this.allAccounts);
      const headers = new Headers();
      headers.append('Content-Type','application.json');            
      this.http.put(this.dataService.getAccessUrl() + 'accounts.json?auth=' + token, body, {headers: headers})
      .map((data: Response) => data.json())
      .subscribe(() => alert('New account added successfully'));
    }


  public setAllUserAccounts(obj : Account[]) : Subscription {      
    return this.baseFetchAccounts().subscribe(acc => {
        obj = acc.filter(a => a.ActiveUsers.findIndex(i => i == this.userService.getAuthUserId()) > -1);
    });  
  }

  public getAccounts(){
    return this.allAccounts;
  }  

  public getAllUserAccounts(){
    const token = this.userService.getTokener();
    this.http.get(this.dataService.getAccessUrl() + 'accounts.json?auth=' + token)    
    .map((response: Response) =>  response.json())
    .subscribe((acc : Account[]) => {
      this.allAccounts = acc.filter(a => a.ActiveUsers.findIndex(i => i == this.userService.getAuthUserId()) > -1);
      this.accountsUpdated.emit(this.allAccounts);
    });
  }  

  public getAccountById(accountId: string) {        
    var account = this.allAccounts.filter(a => a.AccountId == accountId)[0];            
    return account;
  }  

  public baseFetchAccounts() :Observable<Account[]> {
    const token = this.userService.getTokener();
    return this.http.get(this.dataService.getAccessUrl() + 'accounts.json?auth=' + token)    
    .map((response: Response) =>  response.json());    
  }  

  public baseFetchMonthlyPayments() : Observable<MonthlyPayment[]> {
    const token = this.userService.getTokener();
    return this.http.get(this.dataService.getAccessUrl() + 'monthlypayments.json?auth=' + token)
    .map((response: Response) => response.json());
  }

  public fetchAccounts() {      
    const token = this.userService.getTokener();
    this.http.get(this.dataService.getAccessUrl() + 'accounts.json?auth=' + token)
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

  public getAllMonthlyPaymentsFromAccount2(accountId: string) {    
    const token = this.userService.getTokener();
    return this.http.get(this.dataService.getAccessUrl() + 'monthlypayments.json?auth=' + token)
    .map((response: Response) => response.json())
    // .subscribe((monthlyPayment : MonthlyPayment[]) => 
    //   {                                     
    //     //alert(monthlyPayment.length);
    //       //this.monthlyPayments = monthlyPayment.filter(mp => mp.AccountId == accountId);
    //       this.monthlyPayments = monthlyPayment;          
    //       //alert(this.monthlyPayments.length);
    //       this.monthlyPaymentsUpdated.emit(this.monthlyPayments);
    //   });
  }

  public AddNewMonthlyPayment(newMonthlyPayment: MonthlyPayment) {    
    const token = this.userService.getTokener();
    this.baseFetchMonthlyPayments().subscribe(mp => {        
      this.monthlyPayments = mp == null ? new Array<MonthlyPayment>() : mp;      
      this.monthlyPayments.push(newMonthlyPayment);

      newMonthlyPayment.MonthlyPaymentId = this.monthlyPayments.indexOf(newMonthlyPayment).toString();      
    
      const body = JSON.stringify(this.monthlyPayments);
      const headers = new Headers();
      headers.append('Content-Type','application.json');      

      this.http.put(this.dataService.getAccessUrl() + 'monthlypayments.json?auth=' + token, body, {headers: headers})
      .map((data: Response) => data.json())
      .subscribe(() => alert('New monthly payment added successfully'));      
    });            
  }

  public EditMonthlyPayment(newMonthlyPayment: MonthlyPayment, existingMonthlyPaymentId: string) {
    const token = this.userService.getTokener();    
    this.baseFetchMonthlyPayments().subscribe(p => 
    {
      this.monthlyPayments = p;  
      this.monthlyPayments[this.monthlyPayments.indexOf(this.monthlyPayments.filter(m => m.MonthlyPaymentId == existingMonthlyPaymentId)[0])] = newMonthlyPayment;          

      const body = JSON.stringify(this.monthlyPayments);
      const headers = new Headers();
      headers.append('Content-Type', 'application.json');

      this.http.put(this.dataService.getAccessUrl() + 'monthlypayments.json?auth=' + token, body, {headers: headers})
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

  public addNewPayment(newPayment: Payment, accountId: string, userTypeName: string, isCredit : boolean){
    this.updatedAccount = this.getAccountById(accountId);
    if (this.updatedAccount.Transactions == null) {
      this.updatedAccount.Transactions = new Array<Payment>();
    }
    this.updatedAccount.Transactions.push(newPayment);
    
    return this.EditAccountNew(this.updatedAccount, accountId);
  }   

  
  public EditAccountNew(newAccount: Account, accountId: string) {
    const token = this.userService.getTokener();
    var allAccounts = this.getAccounts();

    this.allAccounts[this.allAccounts.indexOf(this.allAccounts.filter(a => a.AccountId === accountId)[0])] = newAccount;

    const body = JSON.stringify(this.allAccounts);
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');
    
    if (token !=undefined) 
    return this.http.put(this.dataService.getAccessUrl() + 'accounts.json?auth=' + token, body, {headers: headers})
      .map((data: Response) => data.json())      
  }


  public EditAccount(newAccount: Account, accountId: string) {
    const token = this.userService.getTokener();
    var allAccounts = this.getAccounts();

    this.allAccounts[this.allAccounts.indexOf(this.allAccounts.filter(a => a.AccountId === accountId)[0])] = newAccount;

    const body = JSON.stringify(this.allAccounts);
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');

    this.http.put(this.dataUrl + 'accounts.json?auth=' + token, body, {headers: headers})
      .map((data: Response) => data.json())
      .subscribe(() => alert('Account edited successfully'));    
  }

  fetchPayments(){
    const token = this.userService.getTokener();
    return this.http.get(this.dataUrl + 'payments.json?auth=' + token)
    .map(response => response.json());
  }  

}
