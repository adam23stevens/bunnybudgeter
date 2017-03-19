import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[bbDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') get opened() {
    return this.isOpen;
  }  
  @HostListener('click') openClose() {
    this.isOpen = !this.isOpen;
  } 
  private isOpen = false;
}
