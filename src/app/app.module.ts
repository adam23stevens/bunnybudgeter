import { DataService } from './data.service';
import { authGuard } from './user/auth/authGuard.service';
import { SigninComponent } from './user/auth/signin/signin.component';
import { SignupComponent } from './user/auth/signup/signup.component';
import { UserService } from './user/user.service';
import { MonthlyPaymentsComponent } from './account/monthly-payments/monthly-payments.component';
import { PaymentTypesService } from './account/payment-types/payment-types.service';
import { routing } from './app.routes';
import { DropdownDirective } from './dropdown-directive';
import { AccountService } from './account/account.service';
import { PaymentTypesComponent } from './account/payment-types/payment-types.component';
import { AccountDetailComponent } from './account/account-detail/account-detail.component';
import { AccountItemComponent } from './account/account-item/account-item.component';
import { AccountListingComponent } from './account/account-listing.component';
//import { AccountModule } from './account/account.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { HomeComponent } from './home/home.component';
import { MonthlyPaymentsEditComponent } from './account/monthly-payments/monthly-payments-edit/monthly-payments-edit.component';
import { InverterPipe } from './account/account-item/inverter.pipe';
import { AccountPaymentsComponent } from './account/account-item/account-payments.component';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './home/landing.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AccountListingComponent,
    AccountItemComponent,
    AccountDetailComponent,
    MonthlyPaymentsComponent,
    PaymentTypesComponent,
    DropdownDirective,
    HomeComponent,
    MonthlyPaymentsEditComponent,
    InverterPipe,
    AccountPaymentsComponent,
    SignupComponent,
    SigninComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,           
    routing,
    ReactiveFormsModule
  ],
  providers: [AccountService, PaymentTypesService, UserService, authGuard, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
