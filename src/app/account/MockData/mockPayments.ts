import { mockUserPaymentTypes } from './mockUserPaymentTypes';
import { Payment } from './../Payment';

 const SalaryIncome: Payment = {
    Name: "Salary - Investec",
    Amount: 2000,
    Date: new Date('23/02/2017'),
    Notes: '',        
    isPending: true,
    isCredit: true
}

const SalaryIncomeJ: Payment = {
    Name: "Salary - Dorking",
    Amount: 2000,
    Date: new Date('27/02/2017'),
    Notes: '',        
    isPending: false,
    isCredit: true
}

 const BonusIncome: Payment = {
    Name: "Yearly bonus",
    Amount: 1000,
    Date: new Date('20/12/2016'),
    Notes: '',        
    isPending: false,
    isCredit: true
}

 const rentPayment: Payment = {
    Name: "Monthly Rent",
    Amount: 900,
    Date: new Date('01/03/2017'),
    Notes: '',        
    isPending: false,
    isCredit: false
}

 const foodPayment : Payment = {
    Name: "Food",
    Amount: 80,
    Date: new Date('01/04/2017'),
    Notes: '',        
    isPending: false,
    isCredit: false
}

 const fuelPayment: Payment = {
    Name: "Fuel",
    Amount: 42.50,
    Date: new Date('01/03/2017'),
    Notes: '',        
    isPending: false,
    isCredit: false
}

 const catFoodPayment: Payment = {
    Name: "CatFood",
    Amount: 8.50,
    Date: new Date('01/03/2017'),
    Notes: '',    
    isPending: false,
    isCredit: false
}

const beerPayment: Payment = {
    Name: 'Beer',
    Amount: 13.50,
    Date: new Date('03/04/17'),
    Notes: '',        
    isPending: false,
    isCredit: false
}

const councilTaxPayment: Payment = {
    Name: 'Council Tax',
    Amount: 148.12,
    Date: new Date('01/03/17'),
    Notes: '',    
    isPending: false,
    isCredit: false
}

export const mockPayments = [SalaryIncome, SalaryIncomeJ, BonusIncome, rentPayment, foodPayment, fuelPayment, catFoodPayment, beerPayment, councilTaxPayment];