import { UserService } from './../../user.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  onSignUp(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    const passwordConfirm = form.value.passwordConfirm;

    if (password != passwordConfirm) {
      alert('Your passwords do not match');
      form.reset();      
    }
    else {
    //create user object - insert to database and set the ID?
    this.userService.signUpUser(email, password);
    }
  }

}
