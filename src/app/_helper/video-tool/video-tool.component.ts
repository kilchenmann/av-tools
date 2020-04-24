import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'kui-video-tool',
    templateUrl: './video-tool.component.html',
    styleUrls: ['./video-tool.component.scss']
})
export class VideoToolComponent implements OnInit {

    videoname: string;
    starttime: number = 0;

    constructor(private _route: ActivatedRoute) {
        this.videoname = this._route.snapshot.params['name'];
        this.starttime = this._route.snapshot.params['start'];
    }

    ngOnInit(): void {
    }

}
