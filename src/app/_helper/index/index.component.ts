import { Component, OnInit } from '@angular/core';

export interface Video {
    'name': string;
    'duration': number;
}

@Component({
    selector: 'kui-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    videos: Video[] = [
        {
            name: 'falcon9',
            duration: 242
        },
        {
            name: 'fitzcarraldo',
            duration: 9432
        },
        {
            name: 'rgb11111',
            duration: 375
        }
    ]

    constructor() { }

    ngOnInit(): void {
    }

}
