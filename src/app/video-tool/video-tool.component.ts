import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'kui-video-tool',
    templateUrl: './video-tool.component.html',
    styleUrls: ['./video-tool.component.scss']
})
export class VideoToolComponent implements OnInit {

    video: string = "falcon9";

    constructor() { }

    ngOnInit(): void {
    }

}
