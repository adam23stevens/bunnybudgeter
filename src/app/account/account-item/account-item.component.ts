import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MonthlyPayment } from './../monthly-payments/monthly-payment';
import { InverterPipe } from './inverter.pipe';
import { Subscription } from 'rxjs/Subscription';
import { Payment } from './../Payment';
import { UserPaymentTypes } from './../UserPaymentTypes';
import { PaymentTypesService } from './../payment-types/payment-types.service';
import { Account } from './../Account';
import { AccountService } from './../account.service';
import { Component, OnInit, Input, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import { isNumber } from "util";

@Component({
  selector: 'bb-account-item',
  templateUrl: './account-item.component.html',
  styles: [`
    .account {
      margin-left: 10px;
      border: 1px #337ab7 solid;
    }
  `]
})
export class AccountItemComponent implements OnInit, OnChanges, OnDestroy {    
  accountId; 
  account: Account = new Account("", "", 0, false, [], new Array<Payment>(), 0, false);
  private formBuilder: FormBuilder = new FormBuilder();
  private paymentForm: FormGroup;
  paymentTypes = new Array<UserPaymentTypes>();
  subscription: Subscription; 
  urlSubscription: Subscription;
  remainingFunds = 0;
  showRemaining: boolean = false;
  accMp = new Array<MonthlyPayment>();
  newPayment: Payment;
  paymentIsCredit: boolean;    
  paymentIsCreditEnable: boolean;
  totalFundsWithOverdraft: number;
  totalFundsAfterMonthlyPayments: number;
  paymentCutOffDate: Date;
  Warning: string = "";
  nextPayDate = new Date();

  constructor(private accountService: AccountService,
              private paymentTypeService: PaymentTypesService,
              private route: ActivatedRoute,
              private router: Router) {      
   }  

   ngOnInit(){
     this.paymentIsCredit = false;    
     this.paymentIsCreditEnable = true;
     this.subscription = this.paymentTypeService.OnPaymentTypesChanged.subscribe(
        (pt : UserPaymentTypes[]) => {           
           if (pt == null) return;
           this.paymentTypes = pt.filter(p => p.AccountId == this.accountId);                                                                                                                                             
        });                                                                                   
        this.urlSubscription = this.route.params.subscribe((p : any) => 
           {                          
             this.accountId = p['AccountId'];
             this.getAccountInfo();
             this.getMonthlyPayments();
             this.CalculateOutgoings();             
             this.paymentTypeService.fetchAllUserPayments();             
             this.initForm();
           });              
   }

   ngOnChanges(){     
   }

   ngOnDestroy() {
     this.subscription.unsubscribe();
   }

    getAccountInfo() {
      if (this.accountId != undefined){
      this.account = this.accountService.getAccountById(this.accountId);        
      }
   }

   getMonthlyPayments() {     
     this.accountService.getAllMonthlyPaymentsFromAccount2(this.accountId).subscribe(
       (mp: MonthlyPayment[]) => {
    //  )
    //  this.accountService.monthlyPaymentsUpdated.subscribe((mp : MonthlyPayment[]) => { 
       if (mp == null) return; 
       var today = new Date();
       for (let m of mp) {    

         var date =  new Date(m.Payments[m.Payments.length -1].Date);       
         var minusDates = 0;
         if (date.getDay() == 0){ //this is a sunday
          minusDates = 2;
         }
         else if (date.getDay() == 6) { //this is a saturday
           minusDates = 1;
         }
                  
        date.setDate(date.getDate() - minusDates);  
        date.setHours(1,0,0,0);

        if (date <= today) {
          m.Payments[m.Payments.length -1].isPending = false;                    
          var payment = m.Payments[m.Payments.length -1];          
          
          this.addPaymentToAccount(payment, m.isCredit);
          
          var nextPayDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
          nextPayDate.setDate(m.DayOfMonth);
          nextPayDate.setHours(1,0,0,0);
          m.Payments.push(new Payment(payment.Name, payment.Amount, nextPayDate, "", true, m.isCredit));     
          m.NextPaymentDate = nextPayDate;
          this.accountService.EditMonthlyPayment(m, m.MonthlyPaymentId);
          alert('Monthly payment taken for ' + payment.Name);                
        }
       }
     });
   }   

   CalculateOutgoings(){          
     if (this.account == undefined) return;
    
     this.account.TotalFunds = 0;
      if(this.account.Transactions != undefined){
        this.account.Transactions.filter(t => !t.isCredit).forEach(
          o => this.account.TotalFunds -= o.isPending ? 0 : o.Amount);
        this.account.Transactions.filter(t => t.isCredit).forEach(
          i => this.account.TotalFunds = i.isPending ? 0 : parseFloat(this.account.TotalFunds.toString()) + parseFloat(i.Amount.toString()));
      }      
      this.totalFundsWithOverdraft = parseFloat(this.account.TotalFunds.toString()) + parseFloat(this.account.OverdraftLimit.toString());  
      this.totalFundsAfterMonthlyPayments = this.totalFundsWithOverdraft;              
      //calculate the remaining funds with the payment types and check if you have enough money to cover all of them here

      this.accountService.getAllMonthlyPaymentsFromAccount2(this.accountId).subscribe(
       (mp: MonthlyPayment[]) => {         
         if (this.account == undefined) return;
         if (this.accountId == undefined) return;
         mp = mp.filter(m => m.AccountId == this.accountId);
         var today = new Date();
         var mPayDay = new Date();
         mPayDay.setDate(this.account.PayDay);
         mPayDay.setHours(1,0,0,0);
         if (today <= mPayDay) {
           this.nextPayDate = mPayDay;
         } else {
           this.nextPayDate = new Date(mPayDay.getFullYear(), mPayDay.getMonth() + 1, mPayDay.getDate());
         }
         for (let m of mp) {
           var thisDate = new Date(m.NextPaymentDate);
           thisDate.setHours(1,0,0,0);
           if (thisDate < this.nextPayDate) {
             this.totalFundsAfterMonthlyPayments -= m.Amount;
           }
         }
       });

   }

   initForm(){          
     let selPaymentType = "";          
     let name = "";
     let amount = "";
      this.paymentForm = this.formBuilder.group({
      SelPaymentType: [selPaymentType],                  
      PaymentName: [name, Validators.required],      
      Amount: [amount, Validators.required]
    });
  }     

  onSubmit(){

    if (!isNumber(this.paymentForm.value.Amount)){
      alert('Invalid amount entered - please try again');
      this.paymentForm.reset();
      return;
    }

    var newPayment = new Payment(
      this.paymentForm.value.PaymentName,
      this.paymentForm.value.Amount,
      new Date(),
      '',      
      false,
      this.paymentIsCredit
    );    

    if (this.remainingFunds - newPayment.Amount < 0 && this.showRemaining && !this.paymentIsCredit) {      
        if (confirm('This payment goes over the limit for the selected payment type. Are you sure about this?')) {
          this.addPaymentToAccount(newPayment, this.paymentIsCredit);                    
        } else {
          this.clearControls();
        }
      } else {
        this.addPaymentToAccount(newPayment, this.paymentIsCredit);
      }      
    }    

    addPaymentToAccount(newPayment : Payment, isCredit : boolean) {
    var paymentType = this.paymentForm.value.SelPaymentType;            

    if (paymentType != undefined) {
      newPayment.paymentTypeName = paymentType;
      } else {
      newPayment.paymentTypeName = 'adhoc';
    }
    if (this.account == undefined) return;
    if (this.account.Transactions == null) {
      this.account.Transactions = new Array<Payment>();
    }
    this.account.Transactions.push(newPayment);
        
    this.accountService.addNewPayment(newPayment, this.account.AccountId, paymentType, isCredit)
    .subscribe(() => {
      if (newPayment.paymentTypeName != 'adhoc') {
      this.assignToPaymentType(newPayment)        
    }      
    this.router.navigate(['/home']);    
    });
      alert('New payment added');                       
    } 

     assignToPaymentType(payment: Payment) {

      var pType : UserPaymentTypes = this.paymentTypeService.getPaymentTypeByNameAndAccountId(payment.paymentTypeName, this.accountId);

      if (pType.Payments == undefined || pType.Payments == null) {
        pType.Payments = new Array<Payment>();
      }
      pType.Payments.push(payment);      
        this.paymentTypeService.updatePaymentType(pType).subscribe(() => {                          
          this.clearControls();                    
      });            
    }
    
  
  clearControls(){        
    this.paymentForm.reset();    
  }

  onChangePaymentType(uptName: string) {
    this.Warning = "";
    if (uptName != 'adhoc') {      
      var pType : UserPaymentTypes = this.paymentTypeService.getPaymentTypeByNameAndAccountId(uptName, this.accountId);
      if (pType != null) {        
        this.remainingFunds = pType.MonthlyAllowance;
        this.paymentIsCredit = pType.IsCredit;
        this.paymentIsCreditEnable = false;
        
        this.showRemaining = !pType.IsCredit;

        //set the day of the month to the new date
        //if this is in the past then a okay
        //if it's in the future then take a month off.
        var today = new Date();
        this.paymentCutOffDate = new Date(today.getFullYear(), today.getMonth(), this.account.PayDay);
        this.paymentCutOffDate.setDate(this.account.PayDay);
        if (today <= this.paymentCutOffDate) {
          this.paymentCutOffDate = new Date(today.getFullYear(), today.getMonth() -1, this.account.PayDay);
        }                
        if (pType.Payments != null) {          
          pType.Payments.forEach(p =>
          {
            var thisDate = new Date(p.Date);
            if (thisDate >= this.paymentCutOffDate)
            this.remainingFunds = this.remainingFunds - p.Amount >= 0 ? 
            this.remainingFunds -= p.Amount :
            0;
          }
          );
          if (parseFloat(this.account.TotalFunds.toString()) +
           parseFloat(this.account.OverdraftLimit.toString()) < parseFloat(this.remainingFunds.toString()))
          {
            this.showRemaining = false;
            this.Warning = 'Warning! you have gone over budget and cannot afford any more for this payment type. Please use adhoc payment';     
          }
        }
      }
      }   else {
      this.showRemaining = false;
      this.paymentIsCreditEnable = true;
    }
  } 
}
  
