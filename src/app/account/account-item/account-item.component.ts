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
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl,Validators, ReactiveFormsModule } from '@angular/forms';

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
  account: Account = new Account("", "", 0, false, [], new Array<Payment>(), new Array<Payment>(), 0, false);
  private formBuilder: FormBuilder = new FormBuilder();
  private paymentForm: FormGroup;
  paymentTypes = new Array<UserPaymentTypes>();
  subscription: Subscription; 
  urlSubscription: Subscription;   
  remainingFunds = 0;
  showRemaining: boolean = false;
  accMp = new Array<MonthlyPayment>();

  constructor(private accountService: AccountService,
              private paymentTypeService: PaymentTypesService,
              private route: ActivatedRoute,
              private router: Router) {      
   }  

   ngOnInit(){    
     this.subscription = this.paymentTypeService.OnPaymentTypesChanged.subscribe(
        (pt : UserPaymentTypes[]) => {           
           this.paymentTypes = pt.filter(p => p.AccountId == this.accountId);                                                                                                
           this.CalculateOutgoings(this.account);            
                      
        });                                                                                   
        this.urlSubscription = this.route.params.subscribe((p : any) => 
           {             
             this.accountId = p['AccountId'];
             this.getAccountInfo();
             this.paymentTypeService.fetchAllUserPayments();
           });
    this.initForm();
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

   CalculateOutgoings(acc: Account){
     acc.TotalFunds = 0;
      if(acc.Outgoings != undefined){
        acc.Outgoings.forEach(
          o => acc.TotalFunds -= o.isPending ? 0 : o.Amount);
      }
      if (acc.Income != undefined){
        acc.Income.forEach(
          i => acc.TotalFunds += i.isPending ? 0 : i.Amount);
      }
   }

   initForm(){          

     let selPaymentType = "";          
     let name = "";
     let amount = "";
      this.paymentForm = this.formBuilder.group({
      SelPaymentType: [selPaymentType, Validators.required],                  
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
      false
    );    

    if (this.remainingFunds - newPayment.Amount < 0 && this.showRemaining) {      
        if (confirm('This payment goes over the limit for the selected payment type. Are you sure about this?')) {
          this.doPayment(newPayment);                    
        } else {
          this.clearControls();
        }
      } else {
        this.doPayment(newPayment);
      }      
    }

    doPayment(newPayment: Payment){
    
    var paymentType = this.paymentForm.value.SelPaymentType;            

    if (paymentType != undefined) {
      newPayment.paymentTypeName = paymentType;
    } else {
      newPayment.paymentTypeName = 'adhoc';
    }

    this.accountService.addNewPayment(newPayment, this.account.AccountId, paymentType)
    .subscribe(() => {
      this.assignToPaymentType(newPayment)            
      // this.getAccountInfo()
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
          this.router.navigate(['/home']);
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

        this.showRemaining = true;
        if (pType.Payments != null) {
          pType.Payments.forEach(p => this.remainingFunds -= p.Amount);
        }
      }
    } else {
      this.showRemaining = false;
    }
  }   
}









