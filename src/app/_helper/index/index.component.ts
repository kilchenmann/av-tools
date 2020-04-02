import { Component, OnInit } from '@angular/core';

export interface Video {
    'name': string;
    'duration': number;
    'description'?: string;
}

@Component({
    selector: 'kui-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    videos: Video[] = [
        {
            name: 'bunny',
            duration: 30,
            description: 'Shortest (Matrix has only three frames) test video with AR 16:9. '
        },
        {
            name: 'falcon9',
            duration: 242,
            description: 'Longer test video from Nasa with AR 16:9'
        },
        {
            name: 'one-week',
            duration: 1477,
            description: 'Long test video with AR 4:3 <br><i>Source: <a href="https://archive.org/details/OneWeek1920" target="_blank">archive.org</a></i>'
        },
        {
            name: 'fitzcarraldo',
            duration: 9432,
            description: 'Long test video with AR ~ 1.85:1<br><i>This could be a hidden resource because I cannot upload it to github</i>'

        },
        {
            name: 'rgb11111',
            duration: 375,
            description: 'Own test video with AR 18:11'
        }
    ]

    constructor() { }

    ngOnInit(): void {
    }

}
