import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Video } from './../_helper/index/index.component';
import { style } from '@angular/animations';

@Component({
    selector: 'kui-video-frame',
    templateUrl: './video-frame.component.html',
    styleUrls: ['./video-frame.component.scss'],
    host: {
        '(mouseenter)': '_onMouseenter($event)',
        '(mouseleave)': '_onMouseleave($event)',
        '(mousemove)': '_onMouseAction($event)'
    }
})
export class VideoFrameComponent implements OnInit {

    @Input() video: Video;
    @Input() value?: number;



    currentTime: number;

    matrix: string;
    matrixWidth: number;
    matrixHeight: number;
    lastMatrixNr: number;
    lastMatrixLine: number;

    frameWidth: number;
    frameHeight: number;
    lastFrameNr: number;

    @ViewChild('frame') frame: ElementRef;

    constructor(private _host: ElementRef) {

    }

    ngOnInit(): void {

        this.currentTime = (this.value ? this.value : 5);

        // read first matrix file
        this.matrix = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_0.jpg';

        // and calculate frame size with correct aspect ratio
        this.calculateSizes(this.matrix);

        this._host.nativeElement.firstElementChild.style['background-image'] = 'url(' + this.matrix + ')';

    }

    calculateSizes(image: string) {

        const img = new Image();
        img.src = image;

        img.addEventListener('load', () => {
            // matrix dimension is:
            this.matrixWidth = img.naturalWidth;
            this.matrixHeight = img.naturalHeight;

            // how many lines does the matrix have? in case of smaller matrix files (duration < 360) the first matrix doesn't have 6 lines
            const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));

            // get matrix frame dimension
            const matrixFrameWidth: number = (this.matrixWidth / 6);
            const matrixFrameHeight: number = (this.matrixHeight / lines);

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

            this.frameWidth = Math.round(matrixFrameWidth / proportion);
            this.frameHeight = Math.round(matrixFrameHeight / proportion)

            console.log('Preview frame size', this.frameWidth, this.frameHeight);

            // set matrix size corresponding to frame width
            this.frame.nativeElement.style['background-size'] = Math.round(this.matrixWidth / proportion) + 'px ' + Math.round(this.matrixHeight / proportion) + 'px';

            this.frame.nativeElement.style['width'] = this.frameWidth + 'px';
            this.frame.nativeElement.style['height'] = this.frameHeight + 'px';

            console.log('- • - • - • - • - • - • - • - • - • - • - • - • ');
        });

    }

    updateFrame(position: number) {

        console.log(position);

        let secondsPerPixel = this.video.duration / this.frameWidth;

        let time = position * secondsPerPixel;

        let curMatrixNr: number = Math.floor(time / 360);

        if (curMatrixNr < 0) {
            curMatrixNr = 0;
        }

        // get current matrix file url; TODO: this will be handled by sipi; no jpg extension needed
        const curMatrixFile = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_' + curMatrixNr + '.jpg';

        // the last matrix file could have another dimension size...
        if (curMatrixNr < this.lastMatrixNr) {
            this.matrixHeight = Math.round(this.frameHeight * 6);
        } else {
            this.lastFrameNr = Math.round(this.video.duration / 10);
            this.lastMatrixLine = Math.ceil((this.lastFrameNr - (this.lastMatrixNr * 36)) / 6);
            this.matrixHeight = Math.round(this.frameHeight * this.lastMatrixLine);
        }


        let curFrameNr: number = Math.floor(this.currentTime / 10) - Math.floor(36 * curMatrixNr);
        if (curFrameNr < 0) {
            curFrameNr = 0;
        }
        if (curFrameNr > this.lastFrameNr) {
            curFrameNr = this.lastFrameNr;
        }

        // calculate current line and columne number in the matrix and get current frame / preview image position
        const curLineNr: number = Math.floor(curFrameNr / 6);
        const curColNr: number = Math.floor(curFrameNr - (curLineNr * 6));
        const curFramePos: string = '-' + (curColNr * this.frameWidth) + 'px -' + (curLineNr * this.frameHeight) + 'px';

        // manipulate css of preview image on the fly
        this._host.nativeElement.firstElementChild.style['background-image'] = 'url(' + curMatrixFile + ')';
        // this.flipbook.nativeElement.style['background-image'] = 'url(' + curMatrixFile + ')';
        this._host.nativeElement.firstElementChild.style['background-position'] = curFramePos;

    }

    _onMouseAction(ev: MouseEvent) {

        this.updateFrame(ev.clientX);

        // this.currentTime = (this.value ? this.value : 5);

        // // read first matrix file
        // this.matrix = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_0.jpg';

        // // and calculate frame size with correct aspect ratio
        // this.calculateSizes(this.matrix);

        // this._host.nativeElement.firstElementChild.style['background-image'] = 'url(' + this.matrix + ')';

        // animate frames
        // let time = 10;
        // while (time > 0) {
        //     this.updateFrame(time);
        //     console.log(time);
        //     setTimeout(() => {
        //         time = (time < this.video.duration ? (time + 10) : 10);
        //     }, 800);
        // }
    }

    _onMouseenter(ev: MouseEvent) {
        this.frameWidth = this._host.nativeElement.offsetWidth * 2;
        // this._host.nativeElement.style['width'] = '200%';
        // this._host.nativeElement.style['height'] = '200%';
    }

    _onMouseleave(ev: MouseEvent) {
        this._host.nativeElement.style['width'] = '100%';
        this._host.nativeElement.style['height'] = '100%';

    }

}
