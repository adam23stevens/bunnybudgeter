import { BunnyBudgeterPage } from './app.po';

describe('bunny-budgeter App', function() {
  let page: BunnyBudgeterPage;

  beforeEach(() => {
    page = new BunnyBudgeterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
