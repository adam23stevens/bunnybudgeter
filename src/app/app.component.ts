import { AccountListingComponent } from './account/account-listing.component';
import { HeaderComponent } from './header.component';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'bb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  ngOnInit(){
    firebase.initializeApp({
      apiKey: "AIzaSyDvpi3xsuSegLlXzLgG--KECsoZ1oG69bc",
      authDomain: "bunnybudgeter.firebaseapp.com"
    });
  }
}
