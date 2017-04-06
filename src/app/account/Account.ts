import { Payment } from './Payment';
import { User } from './../user/User';

export class Account {
    constructor( 
        public AccountId: string,
        public AccountName: string,
        public TotalFunds: number,
        public IsPublic: boolean,
        public ActiveUsers: Array<string>,
        //public Income: Array<Payment>, //whether or not it's monthly is handled on paymentType
        public Transactions: Array<Payment>, //whether it's direct debit or general budgeted or even outgone, handled on payment type        
        public OverdraftLimit: number,
        public IsFavourite: boolean,
        public PayDay?: number //needed to be able to work out when to calculate things from        
        //public WantedItems: Array<Payment> //phase 2
    ) {}
}