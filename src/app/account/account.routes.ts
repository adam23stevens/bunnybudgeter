import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountListingComponent } from './account-listing.component';
import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES : Routes = [    
    {path: 'new', component: AccountDetailComponent},
    {path: ':id', component: AccountDetailComponent},
    {path: ':id/edit', component: AccountDetailComponent}    
];