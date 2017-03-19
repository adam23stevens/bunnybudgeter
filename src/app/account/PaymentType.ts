import { Payment } from './Payment';

export class PaymentType {
    public Name: string;
    public IsAdhoc: boolean;
    public IsCredit: boolean;
    public Payments: Array<Payment>;    
    constructor(){}
}