import { AccountListingComponent } from './account/account-listing.component';
import { HeaderComponent } from './header.component';
import { Component } from '@angular/core';

@Component({
  selector: 'bb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
}
