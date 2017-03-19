import { User } from './User';
import { mockUsers } from './mockData/mockUser';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  constructor() { }
  currUser: User;

  public getLoggedInUser() {
    return this.getAllUsers()[0];
  }

  public getAllUsers() {
    return mockUsers;
  }

  public setLoggedInUser(userId: string) {
    this.currUser = this.getAllUsers().filter(u => u.UserId == userId)[0];        
  }

}
