import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
    frameWidth: number;
    halfFrameWidth: number = Math.round(this.frameWidth / 2);
    // default frame height
    frameHeight: number;
    lastFrameNr: number;

    @ViewChild('frame') frame: ElementRef;

    constructor(private _host: ElementRef) {

    }

    ngOnInit(): void {

        this.loading = true;

        // init frame at position 5 seconds
        this.currentTime = (this.value ? this.value : 5);

        // read first matrix file
        this.matrix = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_0.jpg';

        this.calculateSizes(this.matrix);

        // this.getMatrixDimension(this.matrix)
        //     .then(img => {
        //         // this.calculateSizes(this.naturalWidth, img.naturalHeight);
        //         // console.log(img.naturalWidth);
        //         // this.loading = false;
        //     })
        //     .catch(err => console.error(err));

        // console.log(this._host);
        // console.log(this._host.nativeElement.offsetWidth, this._host.nativeElement.offsetHeight);


        this._host.nativeElement.firstElementChild.style['background-image'] = 'url(' + this.matrix + ')';

    }



    getMatrixDimension(url: string) {

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.addEventListener('load', () => {
                resolve(img)
                // this.calculateSizes(img.width, img.height);
            });
            img.addEventListener('error', err => reject(err));
        });

    }

    calculateSizes(image: string) {

        const img = new Image();
        img.src = image;

        img.addEventListener('load', () => {
            // matrix dimension is:
            const matrixWidth: number = img.naturalWidth;
            const matrixHeight: number = img.naturalHeight;

            // how many lines does the matrix have? in case of smaller matrix files (duration < 360) the first matrix doesn't have 6 lines
            const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));

            // get matrix frame dimension
            const matrixFrameWidth: number = (matrixWidth / 6);
            const matrixFrameHeight: number = (matrixHeight / lines);

            const aspectRatio: number = (matrixFrameWidth / matrixFrameHeight);
            console.log(this.video.name)
            console.log('Aspect ratio', aspectRatio);

            console.log('Matrix frame size', matrixFrameWidth, matrixFrameHeight);

            // get parent element frame dimension in pixels; calculated from host, which fills the parent element by 100%
            const parentFrameWidth: number = this._host.nativeElement.offsetWidth;
            const parentFrameHeight: number = this._host.nativeElement.offsetHeight;

            console.log('Parent frame size', parentFrameWidth, parentFrameHeight);


            // get proportion between matrix frame size and parent frame size to calculate background-size of matrix file
            let proportion: number = (matrixFrameWidth / parentFrameWidth);

            if ((matrixFrameHeight / proportion) > parentFrameHeight) {
                proportion = (matrixFrameHeight / parentFrameHeight);
                console.log('matrix frame height is to high', (proportion));
            } else {
                console.log('matrix frame height is ok', (proportion));
            }

            const frameWidth: number = Math.round(matrixFrameWidth / proportion);
            const frameHeight: number = Math.round(matrixFrameHeight / proportion)

            console.log('Preview frame size', frameWidth, frameHeight);

            // set matrix size corresponding to frame width
            this.frame.nativeElement.style['background-size'] = Math.round(matrixWidth / proportion) + 'px ' + Math.round(matrixHeight / proportion) + 'px';



            // this.frameHeight = Math.round(matrixHeight / lines);


            this.frame.nativeElement.style['width'] = frameWidth + 'px';
            this.frame.nativeElement.style['height'] = frameHeight + 'px';


            console.log('- • - • - • - • - • - • - • - • - • - • - • - • ');
        });




        // this.frameWidth = this._host.nativeElement.offsetWidth;

        // // get width and height of matrix file
        // // if duration > 60s
        // // if duration >= 360s (first matrix has full size)
        // this.matrixWidth = width;
        // this.matrixHeight = height;

        // // how many lines does the matrix have? in case of smaller matrix files (duration < 360) the first matrix doesn't have 6 lines
        // const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));

        // // ratio between matrix file and css frame width
        // const ratio: number = (this.frameWidth * 6) / this.matrixWidth;

        // this.frame.nativeElement.style['background-size'] = Math.round(this.matrixWidth * ratio) + 'px ' + Math.round(this.matrixHeight * ratio) + 'px';

        // // this.frameHeight = Math.round(this.frameWidth / ratio);
        // this.frameHeight = Math.round(this.matrixHeight / lines * ratio);
        // this.aspectRatio = this.frameWidth / this.frameHeight;

        // if (this.frameHeight > this._host.nativeElement.clientHeight) {
        //     this.frameHeight = this._host.nativeElement.clientHeight
        //     this.frameWidth = this.frameWidth * this.aspectRatio;
        // }

        // this.frame.nativeElement.style['width'] = this.frameWidth + 'px';
        // this.frame.nativeElement.style['height'] = this.frameHeight + 'px';

        // console.log(this.frame);

    }

}
