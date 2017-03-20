import { Payment } from './Payment';
import { User } from './../user/User';

export class Account {
    constructor( 
        public AccountId: string,
        public AccountName: string,
        public TotalFunds: number,
        public IsPublic: boolean,
        public ActiveUsers: Array<User>,
        public Income: Array<Payment>, //whether or not it's monthly is handled on paymentType
        public Outgoings: Array<Payment>, //whether it's direct debit or general budgeted or even outgone, handled on payment type        
        public OverdraftLimit: number,
        public IsFavourite: boolean        
        //public WantedItems: Array<Payment> //phase 2
    ) {}
}