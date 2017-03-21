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

  @Input() accountId: string;
  account: Account = new Account("", "", 0, false, [], new Array<Payment>(), new Array<Payment>(), 0, false);
  private formBuilder: FormBuilder = new FormBuilder();
  private paymentForm: FormGroup;
  paymentTypes = new Array<UserPaymentTypes>();
  subscription: Subscription;    
  remainingFunds = 0;
  showRemaining: boolean = false;

  constructor(private accountService: AccountService,
              private paymentTypeService: PaymentTypesService) {      
   }  

   ngOnInit(){                        
     this.getAccountInfo();       

     this.initForm();
   }

   ngOnChanges(){
     this.getAccountInfo();

     this.initForm();
   }

   ngOnDestroy() {
     this.subscription.unsubscribe();
   }

   getAccountInfo() {     
      this.subscription = this.accountService.baseFetchAccounts().subscribe((acc: Account[]) => {              
       this.account = acc.filter(a => a.AccountId == this.accountId)[0];       
       //this.paymentTypes = this.paymentTypeService.getAllPaymentTypesForAccount(this.accountId);                                
       this.paymentTypeService.baseFetchUserPayments().subscribe(pt => {
       this.paymentTypes = pt.filter(p => p.AccountId == this.accountId);              
       });
       if (this.account.Outgoings != null) {
         this.account.Outgoings.forEach(o => 
           this.account.TotalFunds -= o.Amount
         );
       }
        if(this.account.Income != null) {
          this.account.Income.forEach(i => 
            this.account.TotalFunds += i.Amount
          );
        }
     });
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
    var paymentType = this.paymentForm.value.SelPaymentType;            

    if (paymentType != undefined) {
      newPayment.paymentTypeName = paymentType;
    }
    this.accountService.addNewPayment(newPayment, this.account, paymentType);
    
    this.paymentTypeService.baseFetchUserPayments().subscribe(paymentTypes => {
      this.paymentTypes = paymentTypes;
      var editPaymentType = this.paymentTypes.filter(p => p.Name == paymentType)[0];
      
      if(editPaymentType.Payments == undefined || editPaymentType.Payments == null) {
        editPaymentType.Payments = new Array<Payment>();
      }
      editPaymentType.Payments.push(newPayment);
            
      this.paymentTypes[this.paymentTypes.indexOf(
        this.paymentTypes.filter(p => p.Name == paymentType)[0]
      )] = editPaymentType;
      this.paymentTypeService.updatePaymentTypes(this.paymentTypes)
      .subscribe();
    });

    this.clearControls();
  }

  clearControls(){
    alert('New payment done!');
    this.paymentForm.reset();

    this.getAccountInfo();    
  }

  onChangePaymentType(uptName: string) {        
    if (uptName != undefined) {
    this.paymentTypeService.baseFetchUserPayments().subscribe(p =>    
    {      
      var pType = p.filter(x => x.Name == uptName)[0];      
      this.remainingFunds = pType.MonthlyAllowance;
      
      this.showRemaining = true;
      pType.Payments.forEach(p => this.remainingFunds -= p.Amount);
    });
  
    } else {
      this.showRemaining = false;
    }

  }
    
  


  // addToPaymentType(newPayment: Payment) {
  //   var pType = this.paymentForm.value.SelPaymentType;
  //   if (pType != 'adhoc') {      
  //     this.paymentTypes.filter(p => p.Name == pType.Name)[0].Payments.push(newPayment);            
  //   }
  // }


}









