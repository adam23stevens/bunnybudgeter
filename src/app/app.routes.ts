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
    {path: 'accounts', component: AccountListingComponent },        
    {path: 'accounts/:AccountId', component: AccountDetailComponent},
    {path: 'accounts/new', component: AccountDetailComponent},
    {path: 'paymentTypes', component: PaymentTypesComponent},
    {path: 'accounts/:AccountId/monthlypayment', component: MonthlyPaymentsEditComponent},
    {path: 'accounts/:AccountId/monthlypayment/:MonthlyPaymentId', component: MonthlyPaymentsEditComponent}
    // {path: 'accounts/:AccountId/monthlypayments', component: MonthlyPaymentsComponent}        
];

export const routing = RouterModule.forRoot(APP_ROUTES);