import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appNoDblClick]'
})
export class NoDblClickDirective {

    constructor() { }

    @HostListener('click', ['$event'])

    clickEvent(event) {
        const button = (event.srcElement.disabled === undefined) ? event.srcElement.parentElement : event.srcElement;
        console.log(button)
        console.log(event.srcElement.disabled)
        button.setAttribute('disabled', true);
        setTimeout(function () {
            button.removeAttribute('disabled');
        }, 1000);
    }

    // @HostListener('click', ['$event'])
    // clickEvent(event) {
    //     event.srcElement.setAttribute('disabled', true);
    //     setTimeout(function () {
    //         event.srcElement.removeAttribute('disabled');
    //     }, 500);
    // }

}