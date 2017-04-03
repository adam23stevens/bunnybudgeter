import { UserPaymentTypes } from './../UserPaymentTypes';
import { PaymentType } from './../PaymentType';
import { Payment } from './../Payment';

export class MonthlyPayment {
    constructor(        
        public Name : string,        
        public NextPaymentDate: Date,
        public DayOfMonth: number,
        public isCredit: boolean,
        public AccountId: string,
        public Payments: Array<Payment>,
        public Amount: number,
        public IsDeleted: boolean
    ) { }
    public MonthlyPaymentId: string;
}