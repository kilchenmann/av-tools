import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[kuiDisableContextMenu]'
})
export class DisableContextMenuDirective {

    @HostListener('contextmenu', ['$event'])

    onRightClick(event: Event) {
        event.preventDefault();
    }

    constructor() { }

}
