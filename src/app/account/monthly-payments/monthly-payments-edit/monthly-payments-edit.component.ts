import { MonthlyPayment } from './../monthly-payment';
import { Router } from '@angular/router';
import { Payment } from './../../Payment';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from './../../account.service'; 
import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl,Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-monthly-payments-edit',
  templateUrl: './monthly-payments-edit.component.html',
  styles: []
})
export class MonthlyPaymentsEditComponent implements OnInit {

  constructor(private accountService: AccountService, 
              private route : ActivatedRoute,
              private router: Router) { }

  subscription: Subscription;
  dataSubscription: Subscription;
  monthlyPayment : MonthlyPayment;
  isNew: boolean;
  latestPayment: Payment;
  accountId;  
  private formBuilder: FormBuilder = new FormBuilder();
  private monthlyPaymentForm: FormGroup;

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.accountId = params['AccountId'];
        var mpId = params['MonthlyPaymentId'];

        if (mpId != undefined) {
          this.dataSubscription = this.accountService.baseFetchMonthlyPayments()
            .subscribe(allMonthlyPayments => {              
              this.monthlyPayment = allMonthlyPayments.filter(mp => mp.MonthlyPaymentId == mpId)[0];
              //this.latestPayment = this.monthlyPayment.Payments[0];
              this.isNew = false;       
              this.initForm();       
            });                    
        } else {
          this.isNew = true;   
          this.monthlyPayment = new MonthlyPayment("", new Date(), 0, false, this.accountId, new Array<Payment>(), 0, false);
        }
      }
    )
    this.initForm();
  }

  initForm(){
    let name = this.monthlyPayment == undefined ? "" : this.monthlyPayment.Name;
    let day = this.monthlyPayment == undefined ? "" : this.monthlyPayment.DayOfMonth;
    let isCredit = this.monthlyPayment == undefined ? "" : this.monthlyPayment.isCredit;
    let amount = this.monthlyPayment == undefined ? "" : this.monthlyPayment.Amount;    
    this.monthlyPaymentForm = this.formBuilder.group({
      Name: [name, Validators.required],
      Day: [day, Validators.required],
      IsCredit: [isCredit],
      Amount: [amount, Validators.required]
    });
  }

  // getPayment() {
  //   return this.accountService.getPaymentFromMonthlyPaymentRec(this.monthlyPayment.MonthlyPaymentId);
  // }

  calcNextDate(day : number) {
    var d = new Date();
    var thisDate = new Date();
    thisDate.setDate(day);
    if (thisDate < d) {
      thisDate.setMonth(thisDate.getMonth() + 1);      
    }
    alert(thisDate);
    return thisDate;
  }

  onSubmit(){
    var name = this.monthlyPaymentForm.value.Name;
    var day = this.monthlyPaymentForm.value.Day;
    var isCredit = this.monthlyPaymentForm.value.IsCredit;
    var amount = this.monthlyPaymentForm.value.Amount;
    var date = new Date();

    date = this.calcNextDate(day);
    //turn this into the proper date

    var pment = new Payment(name, amount, date , "", true);
    var newMonthlyPayment = new MonthlyPayment(name, date, day, isCredit, this.accountId, this.monthlyPayment.Payments, amount, false);
    
    if (this.isNew) {
    newMonthlyPayment.Payments = new Array<Payment>();
    newMonthlyPayment.Payments.push(pment);
    this.accountService.AddNewMonthlyPayment(newMonthlyPayment);    
  } else {
      newMonthlyPayment.MonthlyPaymentId = this.monthlyPayment.MonthlyPaymentId;      
      this.accountService.EditMonthlyPayment(newMonthlyPayment, this.monthlyPayment.MonthlyPaymentId);
    }        
  }
  onCancel(){
    this.routeBack();
  }

  routeBack(){
    this.router.navigate(['accounts',this.accountId]);
  }
}
