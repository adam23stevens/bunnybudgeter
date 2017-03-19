import { Http, Headers, Response } from "@angular/http";
import { PaymentType } from './../PaymentType';
import { UserPaymentTypes } from './../UserPaymentTypes';
import { mockUserPaymentTypes } from './../MockData/mockUserPaymentTypes';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";

@Injectable()
export class PaymentTypesService {

  private userPayments: Array<UserPaymentTypes> = mockUserPaymentTypes;  
  constructor(private http: Http) { }

  getAllPaymentTypesForAccount(accountId: string){
    return this.userPayments.filter(p => p.AccountId == accountId);
  }

  public AddMockPaymentTypes() {    
    const body = mockUserPaymentTypes;
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');

    return this.http.put('https://bunnybudgeter.firebaseio.com/paymenttypes.json', body, {headers: headers})
    .map((data: Response) => data.json());   
  }

  public updatePaymentTypes(updatedPaymentTypes : UserPaymentTypes[]) {
    const body = updatedPaymentTypes;
    const headers = new Headers();
    headers.append('Content-Type', 'application.json');

    return this.http.put('https://bunnybudgeter.firebaseio.com/paymenttypes.json', body, {headers: headers})
    .map((data: Response) => data.json());   
  }

  public baseFetchUserPayments() :Observable<UserPaymentTypes[]> {
    return this.http.get('https://bunnybudgeter.firebaseio.com/paymenttypes.json')    
    .map((response: Response) =>  response.json());    
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
