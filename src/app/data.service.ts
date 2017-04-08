import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  constructor() { }

  dbType = "test";  

  public getAccessUrl(){
    return 'https://bunnybudgeter.firebaseio.com/' + this.dbType + '/';
  }

}
