import { browser, element, by } from 'protractor';

export class BunnyBudgeterPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('bb-root h1')).getText();
  }
}
