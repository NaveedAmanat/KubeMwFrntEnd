import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[InputField]'
})
export class InputFieldDirective {

  constructor(private _el: ElementRef) { }

  @Input('InputField') value: string;

  onlyNumber = /[^0-9]*/g;
  onlyAlpha = /[^A-Za-z ]*/g;
  onlyAlphaNumaric = /[^0-9A-Za-z ]*/g;

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    if (this.value == 'onlyNumber') {
      this._el.nativeElement.value = initalValue.replace(this.onlyNumber, '');
    } else if (this.value == 'onlyAlpha') {
      this._el.nativeElement.value = initalValue.replace(this.onlyAlpha, '');
    } else if (this.value == 'onlyAlphaNumaric') {
      this._el.nativeElement.value = initalValue.replace(this.onlyAlphaNumaric, '');
    }
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
