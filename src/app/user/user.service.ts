import { User } from './User';
import { mockUsers } from './mockData/mockUser';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  constructor() { this.setLoggedInUser("userA01") }
  currUser: User;

  public getLoggedInUser() {
    return this.currUser;
  }

  public getAllUsers() {
    return mockUsers;
  }

  public setLoggedInUser(userId: string) {
    this.currUser = this.getAllUsers().filter(u => u.UserId == userId)[0];        
  }

}
