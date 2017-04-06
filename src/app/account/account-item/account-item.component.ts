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
             this.CalculateOutgoings(this.account);             
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
     this.accountService.getAllMonthlyPaymentsFromAccount2(this.accountId);
     this.accountService.monthlyPaymentsUpdated.subscribe((mp : MonthlyPayment[]) => { 

       var today = new Date();
       for (let m of mp) {        
         var date =  new Date(m.Payments[m.Payments.length -1].Date);
        if (date <= today) {
          m.Payments[m.Payments.length -1].isPending = false;          
          var payment = m.Payments[m.Payments.length -1];          
          if (m.isCredit) {            
            this.addPaymentToAccount(payment, true);
          } else {            
            this.addPaymentToAccount(payment, false);
          }
          var nextPayDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
          m.Payments.push(new Payment(payment.Name, payment.Amount, nextPayDate, "", true, m.isCredit));     
          m.NextPaymentDate = nextPayDate;
          this.accountService.EditMonthlyPayment(m, m.MonthlyPaymentId);
          alert('Monthly payment taken for ' + payment.Name);                
        }
       }
     });
   }

   CalculateOutgoings(acc: Account){     
     if (acc == undefined) return;
     acc.TotalFunds = 0;
      if(acc.Transactions != undefined){
        acc.Transactions.filter(t => !t.isCredit).forEach(
          o => acc.TotalFunds -= o.isPending ? 0 : o.Amount);
        acc.Transactions.filter(t => t.isCredit).forEach(
          i => acc.TotalFunds += i.isPending ? 0 : i.Amount);              
      }      
      this.totalFundsWithOverdraft = acc.TotalFunds + acc.OverdraftLimit;
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

    if (this.account.Transactions == null) {
      this.account.Transactions = new Array<Payment>();
    }
    this.account.Transactions.push(newPayment);
        
    this.accountService.addNewPayment(newPayment, this.account.AccountId, paymentType, isCredit)
    .subscribe(() => {
      if (newPayment.paymentTypeName != 'adhoc') {
      this.assignToPaymentType(newPayment)        
      }
      alert('New payment added');
      this.router.navigate(['/home']);        
      });            
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
    if (uptName != 'adhoc') {      
      var pType : UserPaymentTypes = this.paymentTypeService.getPaymentTypeByNameAndAccountId(uptName, this.accountId);
      if (pType != null) {        
        this.remainingFunds = pType.MonthlyAllowance;
        this.paymentIsCredit = pType.IsCredit;
        this.paymentIsCreditEnable = false;
        
        this.showRemaining = !pType.IsCredit;
        if (pType.Payments != null) {
          pType.Payments.forEach(p => this.remainingFunds -= p.Amount);
        }
      }
    } else {
      this.showRemaining = false;
      this.paymentIsCreditEnable = true;
    }
  }  
}









