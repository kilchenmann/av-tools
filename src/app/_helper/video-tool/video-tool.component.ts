import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'kui-video-tool',
    templateUrl: './video-tool.component.html',
    styleUrls: ['./video-tool.component.scss']
})
export class VideoToolComponent implements OnInit {

    videoname: string;
    starttime = 0;

    constructor(private route: ActivatedRoute) {
        this.videoname = this.route.snapshot.params.name;
        this.starttime = this.route.snapshot.params.start;
    }

    ngOnInit(): void {
    }

}
