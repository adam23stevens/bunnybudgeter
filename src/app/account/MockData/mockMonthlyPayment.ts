import { mockPayments } from './mockPayments';
import { Payment } from './../Payment';
import { MonthlyPayment } from './../monthly-payments/monthly-payment';

const monthlyPaymentSalary: MonthlyPayment = {
    MonthlyPaymentId: 'S01',
    Name: 'Salary',
    DayOfMonth: 23,
    NextPaymentDate: new Date('23/03/17'),
    isCredit: true,
    AccountId: 'A-SMILE',    
    Payments: [
        mockPayments[0]
    ],
    Amount: 2000,
    IsDeleted: false
}

const rentPayment: MonthlyPayment = {
    MonthlyPaymentId: 'R02',
    Name: 'Rent',
    DayOfMonth: 15,
    NextPaymentDate: new Date('01/04/17'),
    isCredit: false,
    AccountId: 'A-SMILE',    
    Payments: [
        mockPayments[3]
    ],
    Amount: 975,
    IsDeleted: false
}

const councilTaxPayment: MonthlyPayment = {
    MonthlyPaymentId: 'C03',
    Name: 'Council Tax',
    DayOfMonth: 16,
    NextPaymentDate: new Date('01/04/17'),
    isCredit: false,
    AccountId: 'A-SMILE',    
    Payments: [
        mockPayments[8]
    ],
    Amount: 140,
    IsDeleted: false
}

export const mockMonthlyPayments = [monthlyPaymentSalary, rentPayment, councilTaxPayment];
