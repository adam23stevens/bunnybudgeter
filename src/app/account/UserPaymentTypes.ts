import { User } from './../user/User';
import { PaymentType } from './PaymentType';

export class UserPaymentTypes extends PaymentType {    
    public MonthlyAllowance: number;    
    public AccountId : string;
    constructor() { super(); }
}

//This extends the existing allowance marker so that you can set a maximum allowance value and only 
//have so many users actually see it. Users can only see it via an account assignment which needs to be public.

//It's simply a maximum limit to the payments that are recorded for this payment type.

//Don't necessarily need to set it to a specific account Id but i can easily do that if need be.