import { animate, style, transition, trigger, state } from '@angular/animations';
import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, AfterContentChecked, AfterContentInit, AfterViewInit } from '@angular/core';
import { Video } from './../_helper/index/index.component';

@Component({
    selector: 'kui-video-preview',
    templateUrl: './video-preview.component.html',
    styleUrls: ['./video-preview.component.scss'],
    animations: [
        trigger('simpleSearchMenu',
            [
                state('inactive', style({ display: 'none' })),
                state('active', style({ display: 'block' })),
                transition('inactive => true', animate('100ms ease-in')),
                transition('true => inactive', animate('100ms ease-out'))
            ]
        ),
        trigger('grow', [
            transition('void <=> *', []),
            transition('* <=> *', [
                style({ height: '{{startHeight}}px', opacity: 0 }),
                animate('.5s ease'),
            ], { params: { startHeight: 0 } })
        ])
    ]
})
export class VideoPreviewComponent implements OnInit, AfterViewInit {

    @Input() video: Video;

    @ViewChild('matrixEle') matrixEle: ElementRef;
    @ViewChild('flipbook') flipbook: ElementRef;

    preview: boolean = false;

    // video information
    aspectRatio: number;

    startHeight: number = 144;

    // preview image information
    frameWidth: number = 256;
    halfFrameWidth: number = Math.round(this.frameWidth / 2);
    frameHeight: number = 144;
    lastFrameNr: number;

    // preview images are organised in matrix files; we'll need the last number of those files
    matrix: string;
    matrixWidth: number = Math.round(this.frameWidth * 6);
    matrixHeight: number;
    lastMatrixNr: number;
    lastMatrixLine: number;

    // size of progress bar / timeline
    progressBarWidth: number

    // time information
    currentTime: number = 0;
    previewTime: number = 5;

    // seconds per pixel to calculate preview image on timeline
    secondsPerPixel: number;

    time: boolean = false;

    constructor() { }

    ngOnInit(): void {
        // this.updatePreview(this.frameWidth);
        this.previewTime = this.video.duration / 2;

        this.matrix = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_0.jpg'
    }

    ngAfterViewInit() {
        this.calculateSizes();

        this.updatePreview(24);

    }

    toggleFlibbook() {
        this.preview = !this.preview;

        if (this.preview) {
            this.calculateSizes();
        }
    }

    calculateSizes() {
        // get width and height of matrix file
        // if duration > 60s
        // if duration >= 360s (first matrix has full size)
        this.matrixWidth = this.matrixEle.nativeElement.width;
        this.matrixHeight = this.matrixEle.nativeElement.height;

        // how many lines does the matrix have? in case of smaller matrix files (duration < 360) the first matrix doesn't have 6 lines
        const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));

        // ratio between matrix file and css frame width
        const ratio: number = (this.frameWidth * 6) / this.matrixWidth;

        // to calculate frame height, we need the aspect ratio
        this.frameHeight = this.matrixHeight / lines * ratio;

        // video aspect ratio
        this.aspectRatio = this.frameWidth / this.frameHeight;

        // set correct background size for matrix file
        this.flipbook.nativeElement.style['background-size'] = this.matrixWidth * ratio + 'px ' + this.matrixHeight * ratio + 'px';
    }

    updatePreview(position: number) {

        // const position: number = ev.offsetX;

        if (Number.isInteger(position / 6)) {

            // calculate seconds per pixel
            this.secondsPerPixel = this.video.duration / this.frameWidth;

            // get time of mouse position and set preview image time
            this.previewTime = position * this.secondsPerPixel;

            // overflow fixes
            if (this.previewTime < 0) {
                this.previewTime = 0;
            }
            if (this.previewTime > this.video.duration) {
                this.previewTime = this.video.duration;
            }

            // get current matrix image; one matrix contains 6 minute of the video
            let curMatrixNr: number = Math.floor(this.previewTime / 360);

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

            let curFrameNr: number = Math.floor(this.previewTime / 10) - Math.floor(36 * curMatrixNr);
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
            this.flipbook.nativeElement.style['background-image'] = 'url(' + curMatrixFile + ')';
            this.flipbook.nativeElement.style['background-position'] = curFramePos;
        }



    }



}
