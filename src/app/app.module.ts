import { MonthlyPaymentsComponent } from './account/monthly-payments/monthly-payments.component';
import { PaymentTypesService } from './account/payment-types/payment-types.service';
import { routing } from './app.routes';
import { DropdownDirective } from './dropdown-directive';
import { AccountService } from './account/account.service';
import { PaymentTypesComponent } from './account/payment-types/payment-types.component';
import { AccountDetailComponent } from './account/account-detail/account-detail.component';
import { AccountItemComponent } from './account/account-item/account-item.component';
import { UserModule } from './user/user.module';
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
    InverterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, 
    UserModule,        
    routing,
    ReactiveFormsModule
  ],
  providers: [AccountService, PaymentTypesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
