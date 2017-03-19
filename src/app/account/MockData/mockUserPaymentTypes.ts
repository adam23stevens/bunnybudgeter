import { mockUsers } from './../../user/mockData/mockUser';
import { UserPaymentTypes } from './../UserPaymentTypes';

const Food : UserPaymentTypes = {
    Name: "Beer",
    IsAdhoc: false,
    IsCredit: false,    
    MonthlyAllowance: 80,
    AccountId: "A-SMILE",
    Payments: null
}

const Fuel : UserPaymentTypes = {
    Name: "Fuel",
    IsAdhoc: false,
    IsCredit: false,    
    MonthlyAllowance: 200,
    AccountId: 'AJ-natwest-joint',
    Payments: null
}

const CatFood : UserPaymentTypes = {
    Name: "CatFood",
    IsAdhoc: false,
    IsCredit: false,    
    MonthlyAllowance: 180,
    AccountId: 'AJ-natwest-joint',
    Payments: null
}

export const mockUserPaymentTypes = [Food, Fuel, CatFood];