import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'kui-video-tool',
    templateUrl: './video-tool.component.html',
    styleUrls: ['./video-tool.component.scss']
})
export class VideoToolComponent implements OnInit {

    video: string;

    constructor(private _route: ActivatedRoute) {
        this.video = this._route.snapshot.params['name'];
    }

    ngOnInit(): void {
    }

}
