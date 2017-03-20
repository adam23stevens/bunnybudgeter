import { MonthlyPayment } from 'app/account/monthly-payments/monthly-payment';
import { UserPaymentTypes } from './UserPaymentTypes';
import { PaymentType } from './PaymentType';

export class Payment{
    constructor(
        public Name: string,
        public Amount: number,
        public Date: Date,
        public Notes: string,
        //public monthlyPayment: MonthlyPayment, This shouldn't be needed as payments are held as an array in monthly payment        ,
        public isPending: boolean, // if this is true, then it only exists as mark up to be charged at a later date
        public paymentTypeName? : string
    ) {}
}