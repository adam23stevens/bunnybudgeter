import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inverter'
})
export class InverterPipe {
  transform(value) {
    return value.slice().reverse();
  }
}