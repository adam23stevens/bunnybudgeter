import { UserService } from './../../user/user.service';
import { Payment } from './../Payment';
import { User } from './../../user/User';
import { Router } from '@angular/router';
import { Account } from './../Account';
import { AccountService } from './../account.service';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, FormControl,Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'bb-account-detail',
  templateUrl: './account-detail.component.html',
  styles: []
})
export class AccountDetailComponent implements OnInit{

  constructor(public accountService: AccountService
             ,public userService: UserService
             ,public routes: ActivatedRoute
             ,public router :Router) { }

  private subscription;
  private accSubscription;
  private account: Account;  
  private formBuilder: FormBuilder = new FormBuilder();
  private accountForm: FormGroup;
  private isNew = true;
  ngOnInit() {
    this.subscription = this.routes.params.subscribe(
      (params: any) => {        
          var accountId = params['AccountId'];  

          if (accountId != "new") {            
            this.isNew = false;
            //this.account = this.accountService.getAccountById(accountId);                        
            this.accSubscription = this.accountService.baseFetchAccounts().subscribe(
              a => 
            {
                this.account = a.filter(x => x.AccountId == accountId)[0];                                                
                this.initForm();                
              }
            );            
          }                            

          if(this.account == null){
            this.account = new Account("", "", 0, false, [], [], [], 0, false);                    
          }
      });
      this.initForm();    
  }

  onSubmit(){
    const newAccount = new Account("", this.accountForm.value.AccountName, 0, this.accountForm.value.IsPublic, 
    new Array<User>(), new Array<Payment>(), new Array<Payment>(), this.accountForm.value.OverdraftLimit, false);

    newAccount.ActiveUsers.push(this.userService.getLoggedInUser());    
    
    if (this.isNew) {      
      this.accountService.AddNewAccount(newAccount);
    } else {
      newAccount.AccountId = this.account.AccountId;
      newAccount.IsFavourite = this.account.IsFavourite;
      if (this.account.Outgoings != null) {
        newAccount.Outgoings = this.account.Outgoings;
      } 
      if (this.account.Income != null) {
        newAccount.Income = this.account.Income;
      }
      
      this.accountService.EditAccount(newAccount, this.account.AccountId);
    }    

    this.accountForm.reset();
  }

  initForm(){    
    let name = this.account != null ? this.account.AccountName : "";
    let odraftLimit = this.account != null ? this.account.OverdraftLimit : "";
    let isPublic = this.account != null ? this.account.IsPublic : "";
    this.accountForm = this.formBuilder.group({
      AccountName: [name, Validators.required],
      OverdraftLimit: [odraftLimit, Validators.required],
      IsPublic: [isPublic, Validators.required]
    });
  }
  
  // onClickMonthlyPayments(){    
  //   this.router.navigate(['accounts',this.account.AccountId,'monthlypayments']);
  // }

}
