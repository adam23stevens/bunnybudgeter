import { AccountService } from './../account.service';
import { Subscription } from 'rxjs/Subscription';
import { Payment } from 'app/account/Payment';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-account-payments',
  templateUrl: './account-payments.component.html',
  styles: []
})
export class AccountPaymentsComponent implements OnInit, OnChanges {

  @Input() Outgoings; 
  @Input() Income;
  @Input() teststrings;
  constructor(private accountService : AccountService) { }

  outgoingSubs;
  incomeSubs;
  timerSubscription;

  ngOnInit() {}
  ngOnChanges() {}
}
