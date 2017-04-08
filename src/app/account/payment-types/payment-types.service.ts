import { DataService } from './../../data.service';
import { UserService } from './../../user/user.service';
import { Http, Headers, Response } from "@angular/http";
import { PaymentType } from './../PaymentType';
import { UserPaymentTypes } from './../UserPaymentTypes';
import { mockUserPaymentTypes } from './../MockData/mockUserPaymentTypes';
import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Observable } from "rxjs/Rx";

@Injectable()
export class PaymentTypesService implements OnInit {

  private userPayments: Array<UserPaymentTypes> = mockUserPaymentTypes;  
  allPaymentTypes = new Array<UserPaymentTypes>();
  OnPaymentTypesChanged = new EventEmitter<UserPaymentTypes[]>();
  dataUrl = "";
  constructor(private http: Http, private userService : UserService, private dataService : DataService) { }

  ngOnInit(){
    this.fetchAllUserPayments();    
  }

  getAllPaymentTypesForAccount(accountId: string){
    return this.userPayments.filter(p => p.AccountId == accountId);
  }

  public AddMockPaymentTypes() {    
    const token = this.userService.getTokener();
    const body = JSON.stringify(mockUserPaymentTypes);
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');

    return this.http.put(this.dataService.getAccessUrl() + 'paymenttypes.json?auth=' + token, body, {headers: headers})
    .map((data: Response) => data.json());   
  }

  public updatePaymentTypes(updatedPaymentTypes : UserPaymentTypes[]) {
    const token = this.userService.getTokener();
    const body = JSON.stringify(updatedPaymentTypes);
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');

    return this.http.put(this.dataService.getAccessUrl() + 'paymenttypes.json?auth=' + token, body, {headers: headers})
    .map((data: Response) => data.json());   
  }

  public updatePaymentType(updatedPaymentType: UserPaymentTypes) {
    var pTypes = this.getAllUserPaymentTypes();
    pTypes[pTypes.indexOf(pTypes.filter(p => p.AccountId == updatedPaymentType.AccountId)
                                .filter(p => p.Name == updatedPaymentType.Name)[0])] = updatedPaymentType;

    return this.updatePaymentTypes(pTypes);
  }

  public baseFetchUserPayments() :Observable<UserPaymentTypes[]> {
    const token = this.userService.getTokener();
    return this.http.get(this.dataService.getAccessUrl() + 'paymenttypes.json?auth=' + token)    
    .map((response: Response) =>  response.json());    
  }  

  public fetchAllUserPayments() {
    const token = this.userService.getTokener();
    return this.http.get(this.dataService.getAccessUrl() + 'paymenttypes.json?auth=' + token)    
    .map((response: Response) =>  response.json())
    .subscribe(pt => 
    {
      this.allPaymentTypes = pt;
      this.OnPaymentTypesChanged.emit(this.allPaymentTypes);
    });
  }

  public getAllUserPaymentTypes(){
    return this.allPaymentTypes;
  }

  public getPaymentTypeByNameAndAccountId(name: string, accountId: string) {
    return this.getAllUserPaymentTypes()
      .filter(p => p.AccountId == accountId)
      .filter(p => p.Name == name)[0];
  }

  public getAllAccountUserPaymentTypes(accountId: string) {
    return this.getAllUserPaymentTypes().filter(pt => pt.AccountId == accountId);
  }

  getAllStandardDefaultTypes(){
      
  }

  addNewType(upt: UserPaymentTypes) {
    this.userPayments.push(upt);
  }

  removeType(upt: UserPaymentTypes) {    
    this.userPayments.splice(this.userPayments.indexOf(upt), 1);
  }

}
