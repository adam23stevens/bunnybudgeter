import { authGuard } from './user/auth/authGuard.service';
import { SigninComponent } from './user/auth/signin/signin.component';
import { SignupComponent } from './user/auth/signup/signup.component';
import { MonthlyPaymentsEditComponent } from './account/monthly-payments/monthly-payments-edit/monthly-payments-edit.component';
import { MonthlyPaymentsComponent } from './account/monthly-payments/monthly-payments.component';
import { AccountDetailComponent } from './account/account-detail/account-detail.component';
import { ACCOUNT_ROUTES } from './account/account.routes';
import { HomeComponent } from './home/home.component';
import { PaymentTypesComponent } from './account/payment-types/payment-types.component';
import { AccountListingComponent } from './account/account-listing.component';
import { Routes, RouterModule } from '@angular/router';


const APP_ROUTES : Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent },    
    {path: 'home/:AccountId', component: HomeComponent, canActivate: [authGuard]},
    {path: 'signup', component: SignupComponent},
    {path: 'signin', component: SigninComponent},
    {path: 'accounts', component: AccountListingComponent},        
    {path: 'accounts/:AccountId', component: AccountDetailComponent, canActivate: [authGuard]},
    {path: 'accounts/new', component: AccountDetailComponent, canActivate: [authGuard]},
    {path: 'paymentTypes', component: PaymentTypesComponent, canActivate: [authGuard]},
    {path: 'accounts/:AccountId/monthlypayment', component: MonthlyPaymentsEditComponent, canActivate: [authGuard]},
    {path: 'accounts/:AccountId/monthlypayment/:MonthlyPaymentId', component: MonthlyPaymentsEditComponent, canActivate: [authGuard]}
    // {path: 'accounts/:AccountId/monthlypayments', component: MonthlyPaymentsComponent}        
];

export const routing = RouterModule.forRoot(APP_ROUTES);