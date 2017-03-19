import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[bbDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') get opened() {
    return this.isOpen;
  }  
  @HostListener('click') open() {
    this.isOpen = !this.isOpen;
  }
//   @HostListener('mouseleave') close() {
//     this.isOpen = false;
//   }
  private isOpen = false;
}
