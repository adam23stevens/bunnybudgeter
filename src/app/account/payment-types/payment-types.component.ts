import { Account } from './../Account';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from './../../user/user.service';
import { UserPaymentTypes } from './../UserPaymentTypes';
import { AccountService } from './../account.service';
import { PaymentTypesService } from './payment-types.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Payment } from "app/account/Payment";

@Component({
  selector: 'bb-payment-types',
  templateUrl: './payment-types.component.html',
  styles: []
})
export class PaymentTypesComponent implements OnInit {
  accounts: Account[];
  userPaymentTypes = new Array<UserPaymentTypes>();
  subscription: Subscription;

  constructor(private accountService: AccountService
            , private paymentTypeService: PaymentTypesService
            , private userService : UserService) { }

  ngOnInit() {    
    this.subscription = this.accountService.baseFetchAccounts().subscribe(
      acc => {
        this.accounts = acc.filter(a => a.ActiveUsers.findIndex(i => i.UserId == this.userService.getLoggedInUser().UserId) > -1);                           
        for (let a of this.accounts){
          this.paymentTypeService.baseFetchUserPayments().subscribe(pt => {
            if (pt == null) return;
            for (let filteredType of pt.filter(p => p.AccountId == a.AccountId)) {
            this.userPaymentTypes.push(filteredType);
            }
          })      
        }
      }
    );    
  }

  update(){
    
  }

  onAdd(name: string, amount: string, isCredit: boolean, accountId: string) {      
    var upt = new UserPaymentTypes();
    upt.AccountId = accountId;
    upt.Name = name;
    upt.MonthlyAllowance = parseInt(amount);
    upt.IsAdhoc = true;
    upt.IsCredit = isCredit;
    upt.Payments = new Array<Payment>();

    this.userPaymentTypes.push(upt);    
    //this.update();
  }

  onDel(upt: UserPaymentTypes){
    if (confirm("Are you sure you want this payment type removed?")){
    //this.paymentTypeService.removeType(upt);
    this.userPaymentTypes.splice(this.userPaymentTypes.indexOf(upt), 1);    
    //this.update();
    }  
  }

  onSave(){
    this.paymentTypeService.updatePaymentTypes(this.userPaymentTypes).subscribe(() => alert('saved payment types!'));
  }  

}
