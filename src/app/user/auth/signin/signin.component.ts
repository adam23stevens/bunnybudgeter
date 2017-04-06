import { UserService } from './../../user.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  onSignIn(form : NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.userService.signInUser(email, password);
  }
}
