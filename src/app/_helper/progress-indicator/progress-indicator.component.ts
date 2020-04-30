import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'kui-progress-indicator',
    template: `
      <div class="kui-progress-indicator default">
        <div class="line">
            <div class="bounce1" [style.background-color]="color"></div>
            <div class="bounce2" [style.background-color]="color"></div>
            <div class="bounce3" [style.background-color]="color"></div>
        </div>
        <div class="line">
            <div class="bounce3" [style.background-color]="color"></div>
            <div class="bounce1" [style.background-color]="color"></div>
            <div class="bounce2" [style.background-color]="color"></div>
        </div>
    </div>
  `,
    styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent implements OnInit {

    @Input() color? = 'primary';

    constructor() { }

    ngOnInit(): void {
    }

}
