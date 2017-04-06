import { Router } from '@angular/router';
import { User } from './User';
import { mockUsers } from './mockData/mockUser';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class UserService {

  constructor(private router : Router) { }
  currUser: User;
  token: string;

  public getLoggedInUser() {
    return this.getAllUsers()[0];    
  }

  public getAuthUserId(){
    if (firebase.auth().currentUser != null) {
    return firebase.auth().currentUser.uid;
    }
  }

  public getAllUsers() {
    return mockUsers;
  }

  public setLoggedInUser(userId: string) {
    this.currUser = this.getAllUsers().filter(u => u.UserId == userId)[0];        
  }

  signUpUser(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(
        //error => console.log(error)
      )
  }

  signInUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then( response => {        
        if (firebase.auth().currentUser != null) 
        this.router.navigate(['/']);
        firebase.auth().currentUser.getToken().then((tk : string) => this.token = tk)
      })
      .catch(
        //error => console.log(error)
      )      
  }

  public getTokener() {
    if (firebase.auth().currentUser != null)
    firebase.auth().currentUser.getToken().then((tk: string) => this.token = tk);
    return this.token;
  }  

  isAuthenticated(){
    return this.token != null;
  }

  logOut(){
    firebase.auth().signOut();
    this.token = null;
  }

}
