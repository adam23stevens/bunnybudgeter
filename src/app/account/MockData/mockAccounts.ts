import { mockPayments } from './mockPayments';
import { mockUsers } from './../../user/mockData/mockUser';
import { Account } from './../Account';

const accountA : Account = {
    AccountId: "A-SMILE",
    AccountName: "Adam's Smile account",
    TotalFunds: 340,
    IsPublic: false,
    ActiveUsers: [mockUsers[0]],    
    Transactions: [mockPayments[3], mockPayments[4], mockPayments[5], mockPayments[6]],
    OverdraftLimit: 2000,
    IsFavourite: true
}

const accountJ : Account = {
    AccountId: "J-Natwest",
    AccountName: "Julia's Natwest account",
    TotalFunds: 1043,
    IsPublic: false,
    ActiveUsers: [mockUsers[1]],    
    Transactions: [mockPayments[3]],
    OverdraftLimit: 1000,
    IsFavourite: false
}

const accountJoint : Account = {
    AccountId: "AJ-natwest-joint",
    AccountName: "Natwest Joint Account",
    TotalFunds: 450,
    IsPublic: true,
    ActiveUsers: [mockUsers[0], mockUsers[1]],    
    Transactions: [mockPayments[4], mockPayments[5]],
    OverdraftLimit: 100,
    IsFavourite: false
}

export const mockAccounts = [
    accountA, accountJ, accountJoint
];