import { Subscription } from 'rxjs/Subscription';
import { Payment } from './../Payment';
import { AccountService } from './../account.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { MonthlyPayment } from "../monthly-payments/monthly-payment";

@Component({
  selector: 'bb-monthly-payments',
  templateUrl: './monthly-payments.component.html',
  styles: []
})
export class MonthlyPaymentsComponent implements OnInit {

  constructor(private accountService: AccountService) { }

  @Input() accountId;  
  monthlyPayments = new Array<MonthlyPayment>();
  monthlyDebits = new Array<MonthlyPayment>();
  monthlyCredits = new Array<MonthlyPayment>();
  subscription: Subscription;
  recordChangeSubscription: Subscription;

  ngOnInit() {      
    this.update();         
  }

  update(){
    this.subscription = this.accountService.baseFetchMonthlyPayments()
    .subscribe(allMonthlyP =>
    {
      if (allMonthlyP != null) {
        this.monthlyPayments = allMonthlyP.filter(mp => mp != null ? mp.AccountId == this.accountId && !mp.IsDeleted : "");              
        this.monthlyDebits = this.monthlyPayments.filter(p => p.isCredit == false);
        this.monthlyCredits = this.monthlyPayments.filter(p => p.isCredit == true);
      }
    });      
  }

  onDelete(monthlyPaymentId : string){
    if (confirm("Are you sure you want to delete this monthly payment?")) {
      this.accountService.baseFetchMonthlyPayments().subscribe(
        mp => {          
          var d = mp.filter(p => p.MonthlyPaymentId == monthlyPaymentId)[0];
          this.accountService.deleteMonthlyPayment(d);          
        }
      );      
      //this.Update();
    }    
  }
}
