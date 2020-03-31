import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Video } from './../_helper/index/index.component';

@Component({
    selector: 'kui-video-frame',
    templateUrl: './video-frame.component.html',
    styleUrls: ['./video-frame.component.scss']
})
export class VideoFrameComponent implements OnInit {

    loading: boolean = false;

    @Input() video: Video;
    @Input() value: number;

    matrix: string;
    matrixWidth: number;
    matrixHeight: number;

    currentTime: number;

    // video information
    aspectRatio: number;

    // preview image information
    frameWidth: number = 256;
    halfFrameWidth: number = Math.round(this.frameWidth / 2);
    // default frame height
    frameHeight: number = 0;
    lastFrameNr: number;

    constructor(private _host: ElementRef) {

    }

    ngOnInit(): void {

        this.loading = true;

        // init frame at position 5 seconds
        this.currentTime = (this.value ? this.value : 5);

        // read first matrix file
        this.matrix = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_0.jpg';

        this.getMatrixDimension(this.matrix)
            .then(img => {
                // console.log(img.naturalWidth);
                // this.calculateSizes(img.width, img.height);
                // this.loading = false;
            })
            .catch(err => console.error(err));

        console.log(this._host);
        console.log(this._host.nativeElement.offsetWidth, this._host.nativeElement.offsetHeight);

        this._host.nativeElement.style['background-image'] = 'url(' + this.matrix + ')';



    }



    getMatrixDimension(url: string) {

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.addEventListener('load', () => {
                resolve(img)
                this.calculateSizes(img.width, img.height);
            });
            img.addEventListener('error', err => reject(err));
        });

    }

    calculateSizes(width: number, height: number) {

        this.frameWidth = this._host.nativeElement.offsetWidth;

        // get width and height of matrix file
        // if duration > 60s
        // if duration >= 360s (first matrix has full size)
        this.matrixWidth = width;
        this.matrixHeight = height;

        // how many lines does the matrix have? in case of smaller matrix files (duration < 360) the first matrix doesn't have 6 lines
        const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));

        // ratio between matrix file and css frame width
        const ratio: number = (this.frameWidth * 6) / this.matrixWidth;

        console.log('ratio', ratio)

        this._host.nativeElement.style['background-size'] = Math.round(this.matrixWidth * ratio) + 'px ' + Math.round(this.matrixHeight * ratio) + 'px';

        this.frameHeight = Math.round(this.matrixHeight / lines * ratio);
        this.aspectRatio = this.frameWidth / this.frameHeight;
        console.log(this.video.name, this.aspectRatio)
    }

}
